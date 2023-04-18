import { useRouter } from "next/router";

export default function OwnerPage(){
    const router = useRouter();
    const { address } = router.query;
    return <p>Owner: {address}</p>
}