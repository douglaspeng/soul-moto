import styles from './SideBySideIcons.module.css'

export default function SideBySideIcons() {
  return (
    <div className="relative flex gap-[0] group">
      <div className="z-10 aspect-square w-[350px] h-[350px] flex justify-center items-center  transform translate-x-2 group-hover:scale-110 group-hover:-translate-x-5 transition-all duration-300">
        <img
          src="/images/lg-white-text.svg.svg"
          alt="SMC Icon"
          className={`w-full duration-300 transition ${styles.iconImage}`}
        />
      </div>
    
    </div>
  )
}