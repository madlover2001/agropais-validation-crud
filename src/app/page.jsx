import { dbConnect } from "@/utils/mongoose"
import Person from "@/models/Person"
import PersonCard from "@/components/PersonCard"

async function loadPersons(){
  dbConnect()
  const persons = await Person.find()
  return persons
}

async function HomePage(){
  const persons = await loadPersons()
  return(
    <div className="grid grid-cols-1 gap-2">
      {persons.map(person => (
        <PersonCard person={person} key={person.id}/>
      ))}
    </div>
  )
}

export default HomePage