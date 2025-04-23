import { NextResponse } from 'next/server';
import executeQuery from '@/lib/db';
import changeTypeName from "@/lib/helpers"

// 분류 코드 조회
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const name = searchParams.get('name')
    
    let query = 'SELECT * FROM CATEGORY_CODE WHERE type = ?';
    let values = [type];

    if (status) {
      query += ' AND status = ?';
      values.push(status);
    }
    if (name) {
      query += ' AND name = ?';
      values.push(name);
    }


    const results = await executeQuery({
      query: query
      ,values: values
    });
    return NextResponse.json(results);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



// 분류 코드 추가
export async function POST(request){
  try{
    const query = 'INSERT INTO CATEGORY_CODE (type, step1, step2, name, regi_name, date_added, status) VALUES (?, ?, ?, ?, ?, CURDATE(), ?)';
    let values = [];
    
    const body = await request.json();
    const { type, name, step1, step2, regi_name ,status} = body;
    
    // 타입 별 validation 추가 
    if(!(type && (type === 'process' || type === 'product' || type === 'unit' || type === 'scale'))){
      return NextResponse.json({ error: "type 인자가 존재하지 않거나 process, product, unit 중 일치하지 않습니다.."}, { status: 400 });  
    }
    
    //필수값 추가
    if(!name){
      return NextResponse.json({ error: "name 인자가 존재하지 않습니다.."}, { status: 400 });  
    }
    
    //TODO  관리자 하드코딩 로그인 기능 구현 이후 추가.
    if(type === 'process'){
      values = [type,name,'#',name,'관리자','Y'];
    }else if(type === 'product'){
      values = [type,step1,name,name,'관리자','Y'];
    }else if(type === 'unit'){
      values = [type,null,null,name,'관리자','Y'];
    }else if(type === 'scale'){
      values = [type,null,null,name,'관리자','Y'];
    }

    const results = await executeQuery({
      query: query
      ,values: values
    });
    return NextResponse.json(results);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 사용 여부 수정
export async function PUT(request){
  try{
    const query = 'UPDATE CATEGORY_CODE SET status = ? WHERE id = ? ';
    let values = [];
    
    const body = await request.json();
    const { status, id } = body;
    
    const results = await executeQuery({
      query: query
      ,values: [status,id]
    });
    return NextResponse.json(results);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 분류 코드 삭제
export async function DELETE(request){
  try{
    let values = [];
    let query;
    const body = await request.json();
    const { name, id, tab } = body;
    const type = changeTypeName(tab);
    

    if(type === "process"){
      // process 타입일 경우, CATEGORY_CODE에서 해당 항목 삭제
      query = 'DELETE FROM CATEGORY_CODE WHERE id = ? AND name = ?';
      values = [id, name];
      
      // 그 다음 name을 step1으로 사용하는 데이터들도 삭제
      const additionalQuery = 'DELETE FROM CATEGORY_CODE WHERE step1 = ?';
      await executeQuery({
        query: additionalQuery,
        values: [name]
      });
    } else {
      // 다른 타입들의 경우 기본 쿼리 실행
      query = 'DELETE FROM CATEGORY_CODE WHERE id = ? AND name = ?';
      values = [id, name];
    }

    const results = await executeQuery({
      query: query
      ,values: [id,name]
    });
    return NextResponse.json(results);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}