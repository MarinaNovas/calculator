class Calculator{
  do=[];                                              // Массив с действиями калькулятор в формате ['1','+','2']
  done=[];                                            // Массив с историей в формате [['1','+','2','=','3'],...]
  math={                                              // Обьект с мат. операторами
    '+':function(x,y){return x+y},
    '-':function(x,y){return x-y},
    '*':function(x,y){return x*y},
    '/':function(x,y){return x/y},
  }
  constructor(element){
    this.element=element;                             //элемент калькулятора
    this.screen=element.querySelector('.screen');     //элемент экрана калькулятора
    this.history=element.querySelector('.history');   //элемент истории
    this.init();
  }

  init(){
    this.element.addEventListener('click',(e)=>{
      if(e.target.tagName==='BUTTON') this.pressButton(e.target.innerHTML);
    });
  }

  clear(){                                             // Метод для очистки экрана калькулятора
    this.do=[];
    this.updateScreen();
  }

  clearEntry(){                                        // Метод удаления последнего ввода
    this.do.pop();
    this.updateScreen();
  }

  updateScreen(){                                     //Метод для обновления значений на экране калькулятора
    let text = '';
    for(let item of this.do){
      text+=' '+item;
    }
    this.screen.innerHTML=text;
  }

  updateHistory(){                                    //Метод для обновления истории вычислений
      let text = '';
      for(let item of this.done[this.done.length-1]){
        text+=' '+item;
      }

      let div = document.createElement('div');
      div.className='history__item';
      div.innerHTML=text;
      this.history.append(div);
  }

  round(result){
    let str = result.toString();

    if(str.slice(str.indexOf('.')).length>=4){
      result = result*10000;
      result = Math.round(result);
      result=result/10000;
    }

    return result;
  }

  pressButton(btnText){                                  // Метод обрабатывающий нажатие кнопок калькулятора

    //если нажата кнопка с числом
    if(!isNaN(parseFloat(btnText))){

      let lastItem = this.do[this.do.length-1];

      if(!this.do.length || isNaN(parseFloat(lastItem))){
        this.do.push(btnText);
        this.updateScreen();
        return;
      }

      lastItem+=btnText;
      this.do[this.do.length-1]=lastItem;
      this.updateScreen();

      return;
    }

    //если нажата кнопка "C"
    if(btnText==='C'){
      this.clear();
      return;
    }
     //если нажата кнопка "CE"
    if(btnText==='CE'){
      if(!this.do[this.do.length-1]) return;
      this.clearEntry();
      return;
    }
    
     //если нажата кнопка "."
    if(btnText==='.'){
      let lastItem = this.do[this.do.length-1];

      if(!this.do.length || isNaN(parseFloat(lastItem))){
        this.do.push('0.');
        this.updateScreen();
        return;
      }

      return;
    }else{ //если нажаты кнопки операторов "+","-","*","/","="
      if(btnText==='=' && this.do.length>=3){
        let result = parseFloat(this.do[0]);
        let operands = [...this.do];
        operands.splice(0,1);
        while(operands.length>0){
          result=this.math[operands[0]](result,parseFloat(operands[1]));
          operands.splice(0,2);
        }

        result = this.round(result);

        this.do.push('=');
        this.do.push(`${result}`);
        this.done.push(this.do);
        this.do=[`${result}`];
        this.updateHistory();
        this.updateScreen();
        return;
      }

      if(btnText==='=') return;
      
      let lastItem = this.do[this.do.length-1];

      if(!this.do.length || isNaN(parseFloat(lastItem))) return;

      this.do.push(btnText);
      this.updateScreen();
    }
  }
}

const app = new Calculator(document.querySelector('.calculator'));