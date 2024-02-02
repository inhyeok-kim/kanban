import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { DB } from './lib/db/db';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

DB.config.get('init',(config)=>{
    if(!config){
      DB.config.add({key : 'init',value:"true"});
      DB.columns.add({name : '대기'})
        .then(key=>{
          DB.tasks.add({
            columnId : key,
            title : '할일1',
            order : 0
          }).then(()=>{
            DB.tasks.add({
              columnId : key,
              title : '할일2',
              order : 1
            })
          })
        });
      DB.columns.add({name : '진행'})
      DB.columns.add({name : '완료'})
      DB.columns.add({name : '중단'});
    }
});

root.render(
    <App />
);

