import Head from "next/head";
import Layout from "@/components/layout/layout";
import Container from "@/components/layout/container";


export default function Contacts() {
    return (
        <Layout>
            <Head>
                <title>milechain | Contacts</title>
            </Head>
            <Container>
               
                <div className="flex flex-row justify-between mt-20">
                    <div className="flex flex-col content-start mr-5 w-full">
                        <div className="mb-4">
                        <a href="https://github.com/Zeref-zt">
                            <img
                                src="https://avatars.githubusercontent.com/u/56219646?v=4"
                                className="h-auto max-w-full rounded-full"
                                alt="" />
                        </a>
                        </div>
                        <div className="text-left w-fit">
                            <h1 className="text-4xl font-bold text-left pt-6 border-b-2 w-fit border-accent m-auto">
                                Lorenzo
                            </h1>
                        </div>
                        <p className="text-xl p-0 m-0 font-medium text-center pt-3 pb-1 border-accent w-fit">
                            Bio
                        </p>
                        <p>
                            I am a passionate computer science student with a strong curiosity for technology and innovation. Currently, I am pursuing studies in the field of computer science at university of Insubria. I enjoy exploring the challenges that computer science presents and finding creative solutions to complex problems.
                        </p>
                        <p className="text-xl p-0 m-0 font-medium text-center pt-3 pb-1 border-accent w-fit">
                            Email
                        </p>
                        <p>
                            lficazzola@studenti.uninsubria.it
                        </p>
                    </div>
                    <div className="flex flex-col content-start mr-5 w-full">
                        <div className="mb-4">
                            <a href="https://github.com/nicolasguarini">
                            <img
                                src="https://avatars.githubusercontent.com/u/39015033?v=4"
                                className="h-auto max-w-full rounded-full"
                                alt=""
                                />
                            </a>
                        </div>
                        <div className="text-left w-fit">
                            <h1 className="text-4xl font-bold text-left pt-6 border-b-2 w-fit border-accent m-auto">
                                Nicolas
                            </h1>
                        </div>
                        <p className="text-xl p-0 m-0 font-medium text-center pt-3 pb-1 border-accent w-fit">
                            Bio
                        </p>
                        <p>
                            I am a passionate computer science student with a strong curiosity for technology and innovation. Currently, I am pursuing studies in the field of computer science at university of Insubria. I enjoy exploring the challenges that computer science presents and finding creative solutions to complex problems.
                        </p>
                        <p className="text-xl p-0 m-0 font-medium text-center pt-3 pb-1 border-accent w-fit">
                            Email
                        </p>
                        <p>
                            nguarini@studenti.uninsubria.it
                        </p>
                    </div>
                </div>

            </Container>
        </Layout>
    );
}
