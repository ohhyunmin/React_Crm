import  React, { Component } from 'react';
import Customer from './Component/Customer';
import './App.css';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import {withStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  root:{
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  table:{
    minWidth: 1080
  },
  progress: {
    margin: theme.spacing(2)
  }
})

/*
  리액트 생성주기
  1) constructor()
  2) componentwillMount()
  3) render()
  4) componentDidMount()

  porps or state 변경 시 shouldComponentUpdate() 등 실행 후 render 를 다시 해줌
*/

class App extends Component{
  state = {
    customers: "",
    completed: 0 //프로그레스 0%
  }

  componentDidMount(){
    this.timer = setInterval(this.progress, 20);
    //모든 컴포넌트가 모두 읽어진 후 API 등의 데이터를 가져오는 과정을 구현
     this.callApi()
     .then(res => this.setState({customers: res}))
     .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/customers');
    const body = await response.json();
    return body;
  }

  progress = () => {
    const {completed} = this.state;
    this.setState({completed: completed>=100 ? 0 : completed+1})
  }

  render (){
    const {classes} = this.props;
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>번호</TableCell>
              <TableCell>이미지</TableCell>
              <TableCell>이름</TableCell>
              <TableCell>생년월일</TableCell>
              <TableCell>성별</TableCell>
              <TableCell>직업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              //처음 실행 시 customers 데이터가 없을 수 있어 방지하고자함
              this.state.customers ? 
              this.state.customers.map(c=>{
              return(
                <Customer 
                  key={c.ID}
                  id={c.ID}
                  image={c.IMAGE}
                  name={c.NAME}
                  birthday={c.BIRTHDAY}
                  gender={c.GENDER}
                  job={c.JOB}
                />
                )
              }):
              <TableRow>
                <TableCell colSpan="6" align="center">
                  <CircularProgress className={classes.progress} variant="determinate" value={this.state.completed}></CircularProgress>
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

export default withStyles(styles)(App);
