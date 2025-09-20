import "./App.css";
import { userTries } from "./store";
import { randomWord } from "./data";
import { useState } from "react";
import { Button, Flex } from "@chakra-ui/react";

interface Letter {
  1: string,
  2: string,
  3: string,
  4: string,
  5: string,
}

interface Answer {
  id: number,
  letters: Letter,
}

interface Answers {
      data: Answer[],
}

interface Box {
  id: number,
  row: number,
  letter: string,
}

interface Boxes {
  data: Box[],
}

const App = () => {
  const [answers, setAnswers] = useState<Answers>({
    data: [
      {id: 1, letters: {1: "", 2: "", 3: "", 4: "", 5: "",}},
     {id: 2, letters: {1: "", 2: "", 3: "", 4: "", 5: "",}},
      {id: 3, letters: {1: "", 2: "", 3: "", 4: "", 5: "",}},
      {id: 4, letters: {1: "", 2: "", 3: "", 4: "", 5: "",}},
      {id: 5, letters: {1: "", 2: "", 3: "", 4: "", 5: "",}},
      {id: 6, letters: {1: "", 2: "", 3: "", 4: "", 5: "",}},
    ]})
  const [boxes, setBoxes] = useState<Boxes>({ data: [{id: 1, row: 1, letter: "",},
     {id: 2, row: 1, letter: "",},
      {id: 3, row: 1, letter: "",},
      {id: 4, row: 1, letter: "",},
       {id: 5, row: 1, letter: "",},
       {id: 1, row: 2, letter: "",},
       {id: 2, row: 2, letter: "",},
       {id: 3, row: 2, letter: "",},
       {id: 4, row: 2, letter: "",},
       {id: 5, row: 2, letter: "",},
       {id: 1, row: 3, letter: "",},
       {id: 2, row: 3, letter: "",},
       {id: 3, row: 3, letter: "",},
       {id: 4, row: 3, letter: "",},
       {id: 5, row: 3, letter: "",},
       {id: 1, row: 4, letter: "",},
       {id: 2, row: 4, letter: "",},
       {id: 3, row: 4, letter: "",},
       {id: 4, row: 4, letter: "",},
       {id: 5, row: 4, letter: "",},
       {id: 1, row: 5, letter: "",},
       {id: 2, row: 5, letter: "",},
       {id: 3, row: 5, letter: "",},
       {id: 4, row: 5, letter: "",},
       {id: 5, row: 5, letter: "",},
       {id: 1, row: 6, letter: "",},
       {id: 2, row: 6, letter: "",},
       {id: 3, row: 6, letter: "",},
       {id: 4, row: 6, letter: "",},
       {id: 5, row: 6, letter: "",},]
      })

      const keys : string[] = [
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        "Enter↲",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        "⇦",
      ]


  return (
    <>
    <Flex maxW={"500px"} gap={"10px"}>
      {keys.map((k) => {
        <Button>{k}</Button>
      })}
     </Flex>
    </>
  );
};

export default App;
