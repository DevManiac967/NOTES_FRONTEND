import React, { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [notes, setNotes] = useState([])
  const [editId, setEditId] = useState(null)
  const [editData, setEditData] = useState({
    title: "",
    description: ""
  })

  // ✅ Fetch Notes
  const fetchNotes = async () => {
    try {
      const res = await axios.get('http://localhost:3000/notes')
      setNotes(res.data.notes)
    } catch (err) {
      console.error("Fetch Error:", err)
    }
  }

  // ✅ Create Note
  const handleFormSubmit = async (e) => {
    e.preventDefault()

    const { title, description } = e.target.elements

    try {
      await axios.post('http://localhost:3000/note', {
        title: title.value,
        description: description.value
      })

      fetchNotes()
      e.target.reset()
    } catch (err) {
      console.error("Create Error:", err)
    }
  }

  // ✅ Delete Note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/notes/${id}`)
      fetchNotes()
    } catch (err) {
      console.error("Delete Error:", err)
    }
  }

  // ✅ Edit Click
  const handleEditClick = (note) => {
    setEditId(note._id)
    setEditData({
      title: note.title,
      description: note.description
    })
  }

  // ✅ Update Note
  const updateNote = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/note/${id}`, editData)

      setEditId(null)
      fetchNotes()
    } catch (err) {
      console.error("Update Error:", err)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  return (
    <>
      {/* ✅ FORM */}
      <form className='form-container' onSubmit={handleFormSubmit}>
        <label>Title</label>
        <input type="text" name='title' placeholder="Enter title" required />

        <label>Description</label>
        <input type="text" name='description' placeholder="Enter description" required />

        <button type="submit">Add Note</button>
      </form>

      {/* ✅ NOTES */}
      <div className='notes-card'>
        {notes.map((note) => (
          <div className='note-card' key={note._id}>

            {editId === note._id ? (
              <>
                <input
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                />

                <input
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                />

                <button onClick={() => updateNote(note._id)}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <h1>{note.title}</h1>
                <p>{note.description}</p>

                <button onClick={() => handleEditClick(note)}>Edit</button>
                <button onClick={() => deleteNote(note._id)}>Delete</button>
              </>
            )}

          </div>
        ))}
      </div>
    </>
  )
}

export default App