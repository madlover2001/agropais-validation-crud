import { NextResponse } from 'next/server';
import { dbConnect } from '@/utils/mongoose';
import Person from '@/models/Person';

export async function GET() {
  await dbConnect();
  try {
    const persons = await Person.find();
    return NextResponse.json(persons);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const data = await request.json();
    const newPerson = new Person(data);
    console.log(data)
    const savedPerson = await newPerson.save();
    console.log(savedPerson)
    return new NextResponse(JSON.stringify(savedPerson), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
}