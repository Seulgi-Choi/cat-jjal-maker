import React from 'react';
import logo from './logo.svg';
import './App.css';
import Title from './components/Title'


const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};



function CatItem(props) {
  return (
    <li>
      <img src={props.img} style={{ width: '150px' }} />
    </li>
  )
};

function Favorites({ favorites }) { // 중괄호 안쓰고 바로 소괄호 쓰면 return 값 안써도됨
  if (favorites.length == 0) { // 조건부 렌더링
    return <div>사진 위 하트를 눌러 고양이 사진을 저장해보세요!</div>
  }
  return (
    <ul className="favorites">
      {favorites.map(cat => <CatItem img={cat} key={cat} />)}
    </ul>
  )
};

const MainCard = ({ img, onHeartClick, alreadyFavorite }) => {  // 이렇게 적거나 (props.img) 라고 적거나(es6 문법)
  function handleHeartMouseOver() {
  }

  const heartIcon = alreadyFavorite ? "💖" : "🤍";
  return (
    <div className="main-card">
      <img src={img} alt="고양이" width="400" />
      <button onClick={onHeartClick}>{heartIcon}</button>
    </div>
  )
};

const FormEle = ({ updateMainCat }) => { // myHandleName : 내가 짓는 이름
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);

  const [value, setValue] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  function handleInputChange(e) {
    const userValue = e.target.value;
    setErrorMessage('');

    if (includesHangul(userValue)) {
      setErrorMessage("한글은 입력할 수 없습니다");
    }
    setValue(userValue.toUpperCase())
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    setErrorMessage('');
    if (value === "") {
      setErrorMessage('빈 값으로 만들 수 없습니다.');
      return;
    }
    updateMainCat(value);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input type="text" name="name" placeholder="영어 대사를 입력해주세요" onChange={handleInputChange} value={value} />
      <button type="submit">생성</button>
      <p style={{ color: 'red' }}>{errorMessage}</p>
    </form>
  )
};

const App = () => {
  const CAT1 = "https://cataas.com/cat/HSENVDU4ZMqy7KQ0/says/react";
  const CAT2 = "https://cataas.com/cat/BxqL2EjFmtxDkAm2/says/inflearn";
  const CAT3 = "https://cataas.com/cat/18MD6byVC1yKGpXp/says/JavaScript";

  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem('counter')
  });

  const counterTitle = counter === null ? "" : counter + "번째";

  const [mainCat, setMainCat] = React.useState(CAT1);
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem('favorites') || []; // []: 값이 없으면 빈 배열을 넣어라
  })

  const alreadyFavorite = favorites.includes(mainCat)

  async function setInitialCat() {
    const newCat = await fetchCat('First cat');
    console.log(newCat);
    setMainCat(newCat);

  }

  React.useEffect(() => {
    setInitialCat();
  }, []);

  /* React.useEffect(() => {
    console.log("헬로");
  }, [counter]); // counter가 바뀔때만 불린다 */


  async function updateMainCat(value) {
    const newCat = await fetchCat(value);

    setMainCat(newCat);

    setCounter((prev) => { // prev: 바뀌기 전 값
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem('counter', nextCounter);
      return nextCounter;
    })

  }

  function handleHeartClick() { // 이벤트 핸들러 이름 짓는 관례 handle~ 로 시작
    const nextFavorites = [...favorites, mainCat]
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem('favorites', nextFavorites);
  }

  return (
    <div>
      <Title>{counterTitle} 고양이 가라사대</Title>
      <FormEle updateMainCat={updateMainCat} />
      <MainCard img={mainCat} onHeartClick={handleHeartClick} alreadyFavorite={alreadyFavorite} />
      <Favorites favorites={favorites} />
    </div>
  )
}

export default App;
