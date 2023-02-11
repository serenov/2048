import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [score, setScore] = useState(4);
  const status = useRef(0);
  const first = useRef(true);
  const start = useRef([0, 0]);
  const end = useRef([0, 0]);
  const fingerCount = useRef(0);
  const active = useRef(0);
  const flag = useRef(-1);
  const board = useRef([2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0]);
  const handler = (e: string) => {
    let offset = 0;
    let isHorizontal = false;
    switch(e){
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
      active.current = generateTile();
      status.current = theEnd();
      setScore(prev => prev + 2);
    }
  }
  const checkDirection = () => {
  const distance = 30;
    if(Math.abs(start.current[0] - end.current[0]) > Math.abs(start.current[1] - end.current[1])){
      if (start.current[0] - end.current[0] > distance ){
        handler("ArrowLeft");
      }
      else if (end.current[0] - start.current[0] > distance){
        handler("ArrowRight");
      }
    }
    else{
      if (start.current[1] - end.current[1] > distance ){
        handler("ArrowUp");
      }
      else if (end.current[1] - start.current[1] > distance){
        handler("ArrowDown");
      }
    }
  }

  function destination(currentIndex: number, offset: number){
    let i = currentIndex;
    const predicate = (k: number) => offset === 4 || offset === -4? k % 4 === currentIndex % 4: Math.floor(k / 4) === Math.floor(currentIndex / 4);
    while(predicate(i + offset) && board.current[i + offset] === 0){
      i += offset;
    }
    if(predicate(i + offset) && board.current[i + offset] === board.current[currentIndex] && flag.current !== i + offset) {
      flag.current = i + offset;
      return i + offset;
    }
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
    flag.current = -1;
    return canMove;
  }

  function generateTile(){
    let index = 0;
    do{
      index = Math.floor(Math.random() * 16)
    } while(board.current[index] !== 0)
    board.current[index] = (Math.random() < 0.25)? 4: 2;
    return index;

  }

  function theEnd(){
    for(var i = 0; i < 16; i++){
      if (board.current[i] === 2048) return 1;
      if(i % 4 !== 0) {
        if(board.current[i - 1] === 0 || board.current[i] === board.current[i - 1]) return 0;
      }
      else if(i % 4 !== 3){
        if(board.current[i + 1] === 0 || board.current[i] === board.current[i + 1]) return 0;
      }
      else if(i / 4 !== 0){
        if(board.current[i - 4] === 0 || board.current[i] === board.current[i - 4]) return 0;
      }
      else if(i / 4 !== 3){
        if(board.current[i + 4] === 0 || board.current[i] === board.current[i + 4]) return 0;
      }
    }
    return 2;
  }

  useEffect(() => {
    if(first.current){
      document.addEventListener("keydown", (e) => handler(e.key));
      const el = document.getElementById('board');
      if(el){
        el.addEventListener('touchstart', e => {
          fingerCount.current = e.touches.length;
          start.current[0] = e.changedTouches[0].clientX;
          start.current[1] = e.changedTouches[0].clientY;
        })
        el.addEventListener('touchend', e => {
          end.current[0] = e.changedTouches[0].clientX;
          end.current[1] = e.changedTouches[0].clientY;
          if(fingerCount.current === 1){ 
              checkDirection();
          }
        });
      }
      first.current = false;
    }
  }, [])

  return (
    <div id='board'>
      {
        board.current.map((value, index) =>{
          let act = index === active.current? "active": '';
          return(
            <div key={index} className="Cell">
              {value !== 0 && <div key={value} className={`Slide n${value} ${act}`}>{value}</div>}
            </div>
          )
        })
      }
      {status.current === 1 && <div className="status">You won!!!</div>}
      {status.current === 2 && <div className="status"> You lost!!!</div>}
    </div>
  );
}

export default App
