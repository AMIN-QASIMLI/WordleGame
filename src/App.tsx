import "./App.css";
import { userTries } from "./store";
import { randomWord } from "./data";
import { useState, useEffect } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { FaMoon } from "react-icons/fa";
import { MdSunny } from "react-icons/md";

type CellStatus = "empty" | "correct" | "present" | "absent";
interface LetterCell {
  value: string;
  status: CellStatus;
}
interface AnswerRow {
  id: number;
  letters: Record<number, LetterCell>;
}
interface Answers {
  data: AnswerRow[];
}

const emptyCell = (): LetterCell => ({ value: "", status: "empty" });

const initialAnswers = (): Answers => ({
  data: Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    letters: {
      1: emptyCell(),
      2: emptyCell(),
      3: emptyCell(),
      4: emptyCell(),
      5: emptyCell(),
    },
  })),
});

const KEYS = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
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
];

const statusPriority = (a: CellStatus, b: CellStatus) => {
  const order: Record<CellStatus, number> = {
    empty: 0,
    absent: 1,
    present: 2,
    correct: 3,
  };
  return order[b] > order[a] ? b : a;
};

const App = () => {
  const answer = randomWord;
  const [defaultAnswerId, setDefaultAnswerId] = useState<number>(1);
  const [currentPos, setCurrentPos] = useState<number>(1);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const increaseTry = userTries((s) => s.increaseTry);
  const resetTries = userTries((s) => s.resetTries);

  const [darkMode, setDarkMode] = useState<boolean>(
    () => window.localStorage.getItem("darkMode") === "true"
  );
  const [keyStatuses, setKeyStatuses] = useState<Record<string, CellStatus>>(
    {}
  );

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    window.localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  const writeLetter = (letterRaw: string) => {
    const letter = (letterRaw ?? "").toString().trim().toUpperCase();
    if (!/^[A-Z]$/.test(letter)) return;

    setAnswers((prev) => ({
      data: prev.data.map((row) =>
        row.id === defaultAnswerId
          ? {
              ...row,
              letters: {
                ...row.letters,
                [currentPos]: { value: letter, status: "empty" },
              },
            }
          : row
      ),
    }));

    setCurrentPos((p) => (p < 5 ? p + 1 : p));
  };

  const handleBackspace = () => {
    if (currentPos > 1) {
      const newPos = currentPos - 1;
      setAnswers((prev) => ({
        data: prev.data.map((row) =>
          row.id === defaultAnswerId
            ? {
                ...row,
                letters: {
                  ...row.letters,
                  [newPos]: { value: "", status: "empty" },
                },
              }
            : row
        ),
      }));
      setCurrentPos(newPos);
    }
  };

  const handleEnter = () => {
    const row = answers.data.find((r) => r.id === defaultAnswerId);
    if (!row) return;

    const letters = [1, 2, 3, 4, 5].map((i: number) => row.letters[i].value);
    if (letters.some((l) => !l || l.trim() === "")) {
      alert("Please fill all 5 letters before pressing Enter↲.");
      return;
    }

    const guess = letters.map((l) => l.toLowerCase());
    const target = answer.toLowerCase().split("");

    const status: CellStatus[] = ["empty", "empty", "empty", "empty", "empty"];
    const remaining: Record<string, number> = {};
    for (let i = 0; i < 5; i++) {
      if (guess[i] === target[i]) {
        status[i] = "correct";
      } else {
        remaining[target[i]] = (remaining[target[i]] || 0) + 1;
      }
    }
    for (let i = 0; i < 5; i++) {
      if (status[i] === "correct") continue;
      const g = guess[i];
      if (remaining[g] && remaining[g] > 0) {
        status[i] = "present";
        remaining[g] -= 1;
      } else {
        status[i] = "absent";
      }
    }

    setAnswers((prev) => ({
      data: prev.data.map((r) =>
        r.id === defaultAnswerId
          ? {
              ...r,
              letters: {
                1: { value: r.letters[1].value, status: status[0] },
                2: { value: r.letters[2].value, status: status[1] },
                3: { value: r.letters[3].value, status: status[2] },
                4: { value: r.letters[4].value, status: status[3] },
                5: { value: r.letters[5].value, status: status[4] },
              },
            }
          : r
      ),
    }));

    setKeyStatuses((prev) => {
      const next = { ...prev };
      for (let i = 0; i < 5; i++) {
        const letter = guess[i].toUpperCase();
        const newStatus = status[i];
        const old = next[letter] || "empty";
        next[letter] = statusPriority(old, newStatus);
      }
      return next;
    });

    if (status.every((s) => s === "correct")) {
      resetTries();
      alert("You WIN! ඞ");
      window.location.reload();
      return;
    }

    increaseTry();
    if (defaultAnswerId < 6) {
      setDefaultAnswerId((p) => p + 1);
      setCurrentPos(1);
    } else {
      alert(`Game over — you've used all tries. ┗|｀O′|┛
        the word is ${answer}`);
      window.location.reload();
    }
  };

  const handleButtonClick = (buttonText: string) => {
    if (buttonText === "Enter↲") {
      handleEnter();
      return;
    }
    if (buttonText === "⇦") {
      handleBackspace();
      return;
    }
    writeLetter(buttonText);
  };

  const bgFor = (s: CellStatus) => {
    if (s === "correct") return "green.400";
    if (s === "present") return "yellow.400";
    if (s === "absent") return "gray.600";
    return "transparent";
  };

  const keyBgFor = (k: string) => {
    const s = keyStatuses[k];
    if (!s || s === "empty") return "transparent";
    if (s === "correct") return "green.400";
    if (s === "present") return "yellow.400";
    return "gray.600";
  };

  return (
    <Flex gap={"24px"} direction={"column"} padding={"16px"} w={"100%"}>
      <Flex alignItems={"center"} gap={2}>
        <MdSunny onClick={() => setDarkMode(false)} />/
        <FaMoon onClick={() => setDarkMode(true)} />
      </Flex>

      <Flex
        w={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        direction={"column"}
        gap={8}
      >
        <Flex
          maxW={"300px"}
          gap={"10px"}
          wrap={"wrap"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          {answers.data.map((a) => (
            <Flex key={a.id} gap={"10px"} maxW={"300px"} wrap={"wrap"}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Flex
                  key={i}
                  border={darkMode ? "3px solid white" : "3px solid black"}
                  pb={2}
                  pt={2}
                  pr={3}
                  pl={3}
                  minW={"40px"}
                  minH={"40px"}
                  alignItems="center"
                  justifyContent="center"
                  bg={bgFor(a.letters[i].status)}
                >
                  <Text fontWeight="bold">{a.letters[i].value}</Text>
                </Flex>
              ))}
            </Flex>
          ))}
        </Flex>

        <Flex
          maxW={"500px"}
          gap={"10px"}
          wrap={"wrap"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          {KEYS.map((k) => (
            <Button
              p={2}
              key={k}
              onClick={() => handleButtonClick(k)}
              bg={keyBgFor(k)}
              _hover={{ opacity: 0.9 }}
            >
              {k}
            </Button>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default App;
