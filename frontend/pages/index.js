import Head from 'next/head'
import Navbar from "../src/components/Navbar";
import Header from "../src/components/Header";
import ImageList from "../src/components/images/ImageList";
import AlertProvider from "../src/providers/AlertProvider";
import ImageProvider from "../src/providers/ImageProvider";

function HomeContent() {
    return (
        <>
            <Navbar />
            <Head>
                <title>Sam Eskandar Image Repository</title>
                <meta name="description"
                      content="An image repository built by Sam Eskandar for the Shopify Fall 2021 Dev Challenge"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Header />
            <ImageList />
        </>
    )
}

const Home = () => {
    return (
        <AlertProvider>
            <ImageProvider>
                <HomeContent />
            </ImageProvider>
        </AlertProvider>
    )
}

export default Home;
