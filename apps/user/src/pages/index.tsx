import { type NextPageWithLayout } from "./_app";
import { trpc } from "@/utils/trpc";
import ProjectCard from "@/components/project/project-card";
import BannerSection from "./sections/bannerSection";
import GrassEnv from "./sections/grassEnv";
import RetireSection from "./sections/retireSection";
import AllDesc from "./sections/allDesc";
import CreatedByYou from "./sections/createdByYou";
import { type ProjectStatus } from "@ecotoken/db";

interface ProjectType {
    projectID: string;
    ecoTitle: string;
    ecoUrl: string;
    intro: string;
    images: string;
    status: ProjectStatus;
    fundAmount: number;
    fundRecieved: number;
}

const HomePage: NextPageWithLayout = () => {
    const { data, hasNextPage, fetchNextPage } =
        trpc.ecoProjects.getAll.useInfiniteQuery({
            limit: 3,
            benefits: true,
            location: true,
        });

    if (!data) return <div>Loading...</div>;

    return (
        <>
            <div className="mx-auto w-full">
                <BannerSection />

                <div className="grid w-full grid-cols-3 content-start gap-7 bg-[#F0F0F0] py-[5em] px-[7em]">
                    {data.pages.flatMap(
                        ({ projects }: { projects: ProjectType[] }) => {
                            // console.log("Projects", projects);
                            return projects.map(
                                ({
                                    projectID,
                                    ecoTitle,
                                    ecoUrl,
                                    intro,
                                    images,
                                    status,
                                    fundAmount,
                                    fundRecieved,
                                }) => (
                                    <ProjectCard
                                        key={projectID}
                                        status={status}
                                        title={ecoTitle}
                                        url={ecoUrl}
                                        location={"ddd"}
                                        intro={intro}
                                        images={JSON.parse(images)}
                                        fundAmount={fundAmount}
                                        fundRecieved={fundRecieved}
                                    />
                                ),
                            );
                        },
                    )}
                </div>

                <RetireSection />
                <AllDesc />
                <CreatedByYou />
                <GrassEnv />
            </div>
        </>
    );
};
// HomePage.getLayout = (page) => <>{page}</>;

export default HomePage;
