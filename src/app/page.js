import DetailLink from "@/src/app/util/DetailLink"

export default async function Home() {
  return (
    <div className="list-bg">
            <div className="list-item">
              <DetailLink
                contents="자재 선택 페이지"
                urlParam={`/select`}
              />
            </div>
            <div className="list-item">
              <DetailLink
                contents="분류 코드 추가"
                urlParam={`/categoryCode`}
              />
            </div>
    </div>
  );
}
