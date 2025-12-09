import {AllPosts} from '@/app/components/Posts'

export default function PostsPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Rider Blog</h1>
        <p className="text-gray-600 mb-8">
          Stories, experiences, and insights from the Soul Moto Crew community.
        </p>
        <AllPosts />
      </div>
    </div>
  )
}

