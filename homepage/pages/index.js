import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Brewable</title>
        <meta name="description" content="Brew and review coffee" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <div className={styles.grid}>

          <div className={styles.info}>
            <div className={styles.image}>
              <Image src="/icon-round.png" alt="App Icon" width={256} height={256}/>
            </div>

            <h1 className={styles.title}>
              {"Brewable"}
            </h1>

            <p className={styles.description}>
              Brewable is an app for coffee lovers; made to help you keep track of the beans you buy and the brews you produce with them.
            </p>

            <div className={styles.image}>
              <a href="#">
                <Image src="/Download_on_the_App_Store_Badge_blk.svg" alt="Download on the App Store" width={119.66407*1.5} height={40*1.5}/>
              </a>
            </div>
            
          </div>

          <div className={styles.screenshots}>
            <Image src="/iPhone13-HomePage.png" alt="Home Page Screenshot" width={1400*0.20} height={2700*0.20}/>
            <Image src="/iPhone13-DisplayBeans.png" alt="Home Page Screenshot" width={1400*0.20} height={2700*0.20}/>
          </div>

        </div>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/CJSantee/Craft-Coffee"
          target="_blank"
          rel="noopener noreferrer"
        >
          Developed by{' '}
          <span className={styles.github}>
            <Image src="/GitHub.png" alt="GitHub Logo" width={16} height={16} />
          </span>Colin Santee
        </a>
      </footer>
    </div>
  )
}
