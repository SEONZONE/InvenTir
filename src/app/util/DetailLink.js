"use client";

import { useRouter } from "next/navigation";
export default function DetailLink(props) {
  console.log(props)
  let router = useRouter();
  return (
    <button
      onClick={() => {router.push(props.urlParam)}}
    >
      {props.contents ? props.contents : '내용없음'}
    </button>
  );
}
