import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import first from "../../assets/cards/priority_first.svg";
import second from "../../assets/cards/priority_second.svg";
import third from "../../assets/cards/priority_third.svg";
import fourth from "../../assets/cards/priority_fourth.svg";
import fifth from "../../assets/cards/priority_fifth.svg";
import { FaHeart } from "react-icons/fa";

interface MainGameProps {
  // 필요한 다른 속성들...
}

// 카드 객체의 인터페이스 정의
interface Card {
  id: string;
  image: string;
}

// 드래그 앤 드롭에서 사용할 아이템 타입을 정의
const ItemTypes = {
  CARD: "card",
};

// 드래그 가능한 카드 컴포넌트
const DraggableCard: React.FC<Card> = ({ id, image }) => {
  // useDrag 훅을 사용하여 드래그 가능한 속성 설정
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD, // 아이템 타입 설정
    item: { id, image }, // 드래그 시 전달할 데이터
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(), // 드래그 상태 수집
    }),
  }));

  return (
    <div
      ref={drag} // 드래그 가능한 ref 설정
      className="flex h-[70px] w-[70px] cursor-move items-center justify-center"
      style={{ opacity: isDragging ? 0.5 : 1 }} // 드래그 중일 때 투명도 설정
    >
      <img
        src={image}
        alt={`Card ${id}`}
        className="h-full w-full"
        style={{ backgroundColor: "transparent" }}
      />
    </div>
  );
};

// 드랍 존 컴포넌트
const DropZone: React.FC<{
  id: string;
  onDrop: (item: Card, targetId: string) => void;
  droppedImage: string | null;
}> = ({ id, onDrop, droppedImage }) => {
  // useDrop 훅을 사용하여 드랍 가능한 속성 설정
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CARD, // 드랍 가능한 아이템 타입 설정
    drop: (item: Card) => onDrop(item, id), // 드랍 시 호출할 함수
    collect: (monitor) => ({
      isOver: !!monitor.isOver(), // 드랍 존에 아이템이 있는지 상태 수집
    }),
  }));

  return (
    <div
      ref={drop} // 드래그와 드랍 가능한 ref 설정
      className="flex items-center justify-center border-2 border-dashed border-gray-500"
      style={{
        width: "80px",
        height: "80px",
        backgroundColor: isOver ? "lightyellow" : "transparent", // 드랍 존에 아이템이 있을 때 배경색 변경
      }}
    >
      {/* {droppedImage ? (
        <img
          src={droppedImage}
          alt="Dropped Card"
          className="h-[70px] w-[70px]" // 드랍된 카드 이미지 렌더링
        />
      ) : (
        <FaHeart className="text-gray-500 opacity-15" size={70} /> // 드랍된 카드가 없을 때 아이콘 렌더링
      )} */}
      {droppedImage ? (
        <DraggableCard id={id} image={droppedImage} />
      ) : (
        <FaHeart className="text-gray-500 opacity-15" size={70} />
      )}
    </div>
  );
};

const MainGame: React.FC<MainGameProps> = () => {
  // 드랍된 카드 상태 관리
  const [droppedCards, setDroppedCards] = useState<{
    [key: string]: string | null;
  }>({
    word1: null,
    word2: null,
    word3: null,
    word4: null,
    word5: null,
  });

  // 우선순위 카드 정의
  const priorityCards: Card[] = [
    { id: "card1", image: first },
    { id: "card2", image: second },
    { id: "card3", image: third },
    { id: "card4", image: fourth },
    { id: "card5", image: fifth },
  ];

  // 사용 가능한 카드 ID 상태 관리
  const [availableCardIds, setAvailableCardIds] = useState<Set<string>>(
    new Set(priorityCards.map((card) => card.id))
  );

  // 단어카드 정의
  const wordCards = [
    { id: "word1", text: "바다", color: "#2e8bab" },
    { id: "word2", text: "야구", color: "#bb7c7e" },
    { id: "word3", text: "맥주", color: "#bd9a5a" },
    { id: "word4", text: "피아노", color: "#58a279" },
    { id: "word5", text: "놀이공원", color: "#bd80ba" },
  ];

  // 카드 드랍할 때 호출되는 함수
  const handleDrop = (item: Card, targetId: string) => {
    setDroppedCards((prev) => {
      const newDroppedCards = { ...prev };
      Object.keys(newDroppedCards).forEach((key) => {
        if (newDroppedCards[key] === item.image) {
          newDroppedCards[key] = null; // 이미 드랍한 카드 초기화
        }
      });
      return { ...newDroppedCards, [targetId]: item.image }; // 드랍한 카드 상태 업데이트
    });

    setAvailableCardIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(item.id); // 드랍된 카드 사용 불가 상태로 설정
      return newSet;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen w-full items-center justify-center">
        {/* 게임창 */}
        <div className="relative flex h-[620px] w-[900px] flex-col rounded-[20px] bg-[#F0E9F6]">
          {/* 제목 박스 */}
          <div className="absolute -top-5 left-1/2 flex h-[50px] w-[250px] -translate-x-1/2 items-center justify-center rounded-3xl bg-[#8B6CAC]">
            <h1
              className="text-xl text-white"
              style={{ fontFamily: "DNFBitBitv2" }}
            >
              What's it to ya
            </h1>
          </div>
          {/* 게임 영역 */}
          <div className="mt-4 flex flex-1 flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              {/* 설명 영역 */}
              <div
                className="mx-auto flex flex-col justify-center rounded-lg border-2 border-dashed border-custom-purple-color bg-white px-10 py-4 text-center"
                style={{
                  fontFamily: "DungGeunMo",
                  width: "700px",
                }}
              >
                <p className="mb-2 text-2xl">당신이 선입니다!</p>
                <p className="text-2xl">
                  다섯 개의 단어 카드를 보고 우선순위를 정해주세요
                </p>
              </div>
              {/* 다섯 개의 단어 카드 영역 */}
              <div className="card-container mt-8 flex flex-row space-x-6">
                {wordCards.map((card) => (
                  <div
                    key={card.id}
                    className="border-3 flex flex-col items-center justify-center rounded-xl p-4 shadow-2xl"
                    style={{
                      width: "120px",
                      height: "160px",
                      backgroundColor: card.color,
                    }}
                  >
                    <p
                      className="text-sm"
                      style={{ fontFamily: "DungGeunMo", color: "white" }}
                    >
                      MONEY&LOVE
                    </p>
                    <p
                      className="mb-14 mt-11 text-xl text-white"
                      style={{ fontFamily: "DungGeunMo" }}
                    >
                      {card.text}
                    </p>
                  </div>
                ))}
              </div>
              {/* 드래그 앤 드롭 영역 */}
              <div className="mt-5 flex justify-center space-x-16">
                {wordCards.map((card) => (
                  <DropZone
                    key={card.id}
                    id={card.id} // 드랍 존의 고유 ID를 설정
                    onDrop={handleDrop} // 카드가 드랍될 때 호출되는 함수
                    droppedImage={droppedCards[card.id]} // 드랍된 카드의 이미지를 설정
                  />
                ))}
              </div>
              {/* 드래그 앤 드롭 영역 */}
              <div className="mt-5 flex justify-center space-x-16">
                {priorityCards.map((card) => (
                  <div
                    key={card.id}
                    className="flex items-center justify-center"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <FaHeart className="text-gray-500 opacity-0" size={70} />
                  </div>
                ))}
              </div>
            </div>
            {/* 게임 로직을 여기에 구현 */}
          </div>
        </div>
        {/* 게임창 밖 우선순위 정하는 카드들 영역*/}
        <div className="absolute right-5 top-[38%] flex -translate-y-1/2 transform flex-col space-y-3 rounded-lg bg-white bg-opacity-80 px-10 py-6 shadow-lg">
          {priorityCards.map((card) =>
            availableCardIds.has(card.id) ? (
              <DraggableCard key={card.id} id={card.id} image={card.image} />
            ) : (
              <div key={card.id} className="h-[70px] w-[70px]"></div> // 빈 공간을 유지
            )
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default MainGame;
