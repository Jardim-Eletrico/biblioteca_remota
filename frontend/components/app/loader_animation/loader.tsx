import { Leapfrog } from "ldrs/react";
import { leapfrog } from "ldrs";
import "ldrs/react/Leapfrog.css";

interface LoaderProps {
    className?: string;
}

export default function Loader( { className }: LoaderProps) {
    leapfrog.register();
    return(
        <div className={className}>
            <Leapfrog 
            size="40" 
            speed="2.5" 
            color="#2563EB" />
        </div>
    )
}