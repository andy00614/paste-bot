import { ipcRenderer } from 'electron';
import React, {
  BaseSyntheticEvent,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import useIpcRender from './hooks/useIpcRender';
import './App.global.scss';
import TextField from '@material-ui/core/TextField';
import TextService from './db/text_service';
import { TextTableType } from './db/var';

const Hello = () => {
  const [textList, setTextList] = useState<TextTableType[]>([]);
  useEffect(() => {
    const textService = new TextService();
    const getListThenSet = async () => {
      const list = await textService.getTexts();
      setTextList(list);
    };
    ipcRenderer.on('set-clipboard', async (_, text: string) => {
      await textService.addText({
        text,
        date: new Date(),
      });
      getListThenSet();
    });
    getListThenSet();
  }, []);
  // useIpcRender();
  const textOnchang = (e: { target: { value: string } }) => {
    const textService = new TextService();
    const { value } = e.target;
    textService.getTextByWord(value);
  };
  return (
    <>
      <TextField
        onChange={textOnchang}
        id="standard-search"
        label="Search field"
        type="search"
      />
      <ul>
        {textList.map((item) => {
          return <li key={item.id}>{item.text}</li>;
        })}
      </ul>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
