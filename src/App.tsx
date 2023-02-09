import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [score, setScore] = useState(4);
  var first = true;
  const board = useRef([ 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  function destination(currentIndex: number, offset: number){
    let i = currentIndex;
    const predicate = (k: number) => offset === 4 || offset === -4? k % 4 === currentIndex % 4: Math.floor(k / 4) === Math.floor(currentIndex / 4);
    while(predicate(i + offset) && board.current[i + offset] === 0){
      i += offset;
    }
    if(board.current[i + offset] === board.current[currentIndex]) return i + offset;
    else return i;
  }
  function Movement(offset: number,  isHorizontal: boolean){
    let count = 0;
    let temp = 0;
    let canMove = false;
    const predicate = (k:number) => isHorizontal? (offset > 0? k % 4 !== 3: k % 4 !== 0):(offset > 0? k < 12: k > 3);
    for(let i = offset > 0? 15: 0; count < 16; i += -offset){
      if(board.current[i] !== 0 && predicate(i)){
        temp = destination(i, isHorizontal? offset > 0? 1: -1: offset > 0? 4: -4);
        if(temp !== i){
          board.current[temp] += board.current[i];
          board.current[i] = 0;
          canMove = true;
        }
      }
      count++;
    }
    return canMove;
  }

  function generateTile(){
    let index = 0;
    do{
      index = Math.floor(Math.random() * 16)
    } while(board.current[index] !== 0)
    board.current[index] = (Math.random() < 0.25)? 4: 2;
    console.log("random ", index);
    console.log("board ", board.current[index]);

  }
  useEffect(() => {
    if(first)document.addEventListener("keydown",
    (e) => {
      let offset = 0;
      let isHorizontal = false;
      switch(e.key){
        case "ArrowUp":
          offset = -1;
          break;
        case "ArrowDown":
          offset = 1;
          break;
        case "ArrowRight":
          offset = 1;
          isHorizontal = true
          break;
        case "ArrowLeft":
          offset = -1;
          isHorizontal = true;
        }
        if(Movement(offset, isHorizontal)){
          generateTile();
          setScore(prev => prev + 2);
        }
      }
    )
    first = false;
  }, [])

  return (
    <div id='board'>
      {
        board.current.map((value, index) =>{
          return(
            <div key={index} className="Cell">
              {value !== 0 && <div key={value} className={`Slide n${value}`}>{value}</div>}
            </div>
          )
        })
      }
    </div>
  );
}

export default App
