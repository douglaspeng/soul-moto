import {useEffect, useState, useCallback} from 'react'
import {useClient} from 'sanity'
import {Box, Card, Flex, Stack, Text, Badge, Spinner} from '@sanity/ui'
import {TagIcon, TrashIcon} from '@sanity/icons'

interface GearOrder {
  _id: string
  name: string
  clothType: string
  size: string
  color: string
  paid: boolean
  received: boolean
  orderedAt: string
}

export function GearOrdersTable() {
  const client = useClient({apiVersion: '2024-01-01'})
  const [orders, setOrders] = useState<GearOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const data = await client.fetch<GearOrder[]>(
        `*[_type == "gearOrder"] | order(orderedAt desc) {
          _id,
          name,
          clothType,
          size,
          color,
          paid,
          received,
          orderedAt
        }`,
      )
      setOrders(data)
    } finally {
      setLoading(false)
    }
  }, [client])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleReceivedChange = async (id: string, received: boolean) => {
    setSavingId(id)
    try {
      await client.patch(id).set({received}).commit()
      setOrders((prev) =>
        prev.map((order) => (order._id === id ? {...order, received} : order)),
      )
    } finally {
      setSavingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await client.delete(id)
      setOrders((prev) => prev.filter((order) => order._id !== id))
    } finally {
      setDeletingId(null)
      setConfirmDeleteId(null)
    }
  }

  const clothTypeLabel = (type: string) => (type === 'hoodie' ? 'Hoodie' : 'T-Shirt')

  if (loading) {
    return (
      <Box padding={6}>
        <Flex align="center" justify="center" gap={3}>
          <Spinner />
          <Text>Loading gear orders...</Text>
        </Flex>
      </Box>
    )
  }

  return (
    <Box padding={4}>
      <Stack space={4}>
        {/* Header */}
        <Flex align="center" gap={3} paddingBottom={3}>
          <TagIcon style={{width: 24, height: 24}} />
          <Text size={3} weight="bold">
            Gear Orders ({orders.length})
          </Text>
        </Flex>

        {orders.length === 0 ? (
          <Card padding={6} radius={2} tone="transparent" border>
            <Flex align="center" justify="center">
              <Text muted>No gear orders yet.</Text>
            </Flex>
          </Card>
        ) : (
          <Card radius={2} overflow="auto" border>
            <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 14}}>
              <thead>
                <tr style={{borderBottom: '1px solid var(--card-border-color)'}}>
                  {['Name', 'Type', 'Size', 'Color', 'Ordered At', 'Paid', 'Received', ''].map((col) => (
                    <th
                      key={col}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: 600,
                        color: 'var(--card-muted-fg-color)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr
                    key={order._id}
                    style={{
                      borderBottom:
                        idx < orders.length - 1 ? '1px solid var(--card-border-color)' : 'none',
                      background: order.received
                        ? 'var(--card-success-bg-color, rgba(0,200,100,0.06))'
                        : undefined,
                    }}
                  >
                    <td style={{padding: '12px 16px', fontWeight: 500}}>
                      {order.name || '—'}
                    </td>
                    <td style={{padding: '12px 16px'}}>
                      <Badge tone="primary" radius={2}>
                        {clothTypeLabel(order.clothType)}
                      </Badge>
                    </td>
                    <td style={{padding: '12px 16px'}}>
                      <Badge tone="default" radius={2}>
                        {order.size}
                      </Badge>
                    </td>
                    <td style={{padding: '12px 16px'}}>
                      <Flex align="center" gap={2}>
                        <span
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            background: order.color === 'White' ? '#ffffff' : '#000000',
                            border: '1px solid var(--card-border-color)',
                            display: 'inline-block',
                            flexShrink: 0,
                          }}
                        />
                        <Text size={1}>{order.color}</Text>
                      </Flex>
                    </td>
                    <td style={{padding: '12px 16px', color: 'var(--card-muted-fg-color)'}}>
                      {order.orderedAt
                        ? new Date(order.orderedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td style={{padding: '12px 16px'}}>
                      <Flex align="center" gap={2}>
                        {savingId === `paid-${order._id}` ? (
                          <Spinner style={{width: 16, height: 16}} />
                        ) : (
                          <input
                            type="checkbox"
                            checked={order.paid ?? false}
                            onChange={async (e) => {
                              setSavingId(`paid-${order._id}`)
                              try {
                                await client.patch(order._id).set({paid: e.target.checked}).commit()
                                setOrders((prev) =>
                                  prev.map((o) => (o._id === order._id ? {...o, paid: e.target.checked} : o)),
                                )
                              } finally {
                                setSavingId(null)
                              }
                            }}
                            style={{width: 18, height: 18, cursor: 'pointer', accentColor: '#0f62fe'}}
                            title={order.paid ? 'Mark as unpaid' : 'Mark as paid'}
                          />
                        )}
                        <Text size={1} muted>
                          {order.paid ? 'Paid' : 'Unpaid'}
                        </Text>
                      </Flex>
                    </td>
                    <td style={{padding: '12px 16px'}}>
                      <Flex align="center" gap={2}>
                        {savingId === order._id ? (
                          <Spinner style={{width: 16, height: 16}} />
                        ) : (
                          <input
                            type="checkbox"
                            checked={order.received ?? false}
                            onChange={(e) => handleReceivedChange(order._id, e.target.checked)}
                            style={{width: 18, height: 18, cursor: 'pointer', accentColor: '#0f62fe'}}
                            title={order.received ? 'Mark as not received' : 'Mark as received'}
                          />
                        )}
                        <Text size={1} muted>
                          {order.received ? 'Received' : 'Pending'}
                        </Text>
                      </Flex>
                    </td>
                    <td style={{padding: '12px 16px'}}>
                      {confirmDeleteId === order._id ? (
                        <Flex align="center" gap={2}>
                          <button
                            onClick={() => handleDelete(order._id)}
                            disabled={deletingId === order._id}
                            style={{
                              padding: '4px 10px',
                              background: '#e53e3e',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 4,
                              cursor: 'pointer',
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            {deletingId === order._id ? '...' : 'Confirm'}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            disabled={deletingId === order._id}
                            style={{
                              padding: '4px 10px',
                              background: 'transparent',
                              color: 'var(--card-muted-fg-color)',
                              border: '1px solid var(--card-border-color)',
                              borderRadius: 4,
                              cursor: 'pointer',
                              fontSize: 12,
                            }}
                          >
                            Cancel
                          </button>
                        </Flex>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(order._id)}
                          title="Delete order"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 4,
                            color: 'var(--card-muted-fg-color)',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <TrashIcon style={{width: 18, height: 18}} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </Stack>
    </Box>
  )
}
