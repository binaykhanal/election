    "use client";

    import { useEffect } from "react";

    export default function ViewCounter({ blogId }) {
    useEffect(() => {
        fetch(`/api/blogs/${blogId}/view`, {
        method: "POST",
        }).catch((err) => console.error("Failed to count view", err));
    }, [blogId]);

    return null;
    }
