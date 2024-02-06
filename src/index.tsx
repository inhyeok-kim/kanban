import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { DB } from './lib/db/db';
import { BrowserRouter } from 'react-router-dom';

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
      DB.columns.add({name : '백로그'});
    } else {
      if(config){
        DB.config.get('version',(version)=>{
          if(!version){
            DB.config.add({key:'version',value:'0.4'});
            DB.columns.add({name : '백로그'});
          } else {
            if(version.value === '0.4'){
            }
          }
        })
      }
    }
});


root.render(
  <BrowserRouter basename='/'>
    <App />
  </BrowserRouter>
);

