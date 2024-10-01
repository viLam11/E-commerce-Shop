export default function Form() {
    return(
      <main>
        <h1>Hello World</h1>
        <form action='http://localhost:4000/print/printFile' method="POST" enctype="multipart/form-data">
          <div>
            <label>File Name: </label>
            <input type="text"></input> 
          </div>
          <div>
            <label>File: </label>
            <input name="sampleFile" type="file"></input> 
          </div>
          <br></br>
          <button type="submit">Submit</button>
        </form>
      </main>
    )
}