import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

// 분류 코드 조회
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const name = searchParams.get('name');

    let query = supabase.from('CATEGORY_CODE').select('*');

    if (type) {
      query = query.eq('type', type);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (name) {
      query = query.eq('name', name);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 분류 코드 추가
export async function POST(request) {
  try {
    const body = await request.json();
    const { type, name, step1, step2, regi_name, status, unit } = body;

    if (!type || !['process', 'product'].includes(type)) {
      return NextResponse.json({ error: "type 인자가 존재하지 않거나 process, product 중 일치하지 않습니다.." }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ error: "name 인자가 존재하지 않습니다.." }, { status: 400 });
    }

    let insertData = {};
    if (type === 'process') {
      insertData = { type, step1: name, step2: '#', name, regi_name: '관리자', date_added: new Date(), status: 'Y', unit };
    } else if (type === 'product') {
      insertData = { type, step1, step2: name, name, regi_name: '관리자', date_added: new Date(), status: 'Y', unit };
    }

    const { data, error } = await supabase.from('CATEGORY_CODE').insert([insertData]).select();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 사용 여부 수정
export async function PUT(request) {
  try {
    const body = await request.json();
    const { status, id } = body;

    const { data, error } = await supabase
      .from('CATEGORY_CODE')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 분류 코드 삭제
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { name, id, tab } = body;
    const type = tab; // Assuming tab is already the correct type, e.g., 'process'

    if (type === "process") {
      // First, delete related product entries
      const { error: productError } = await supabase.from('CATEGORY_CODE').delete().eq('step1', name);
      if (productError) throw productError;

      // Then, delete the process entry
      const { error: processError } = await supabase.from('CATEGORY_CODE').delete().eq('id', id);
      if (processError) throw processError;

    } else {
      const { error } = await supabase.from('CATEGORY_CODE').delete().eq('id', id);
      if (error) throw error;
    }

    return NextResponse.json({ message: "Delete successful" });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}