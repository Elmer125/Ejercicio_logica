const csv = require("csv-parser");
const fs = require("fs");
const results: any[] = [];
const object: any[] = [];
const data: any[] = [];

function totalPoblation(data: any[]) {
  return data
    .map((item) => parseInt(item.population))
    .reduce((prev, curr) => prev + curr, 0);
}

function totalDeaths(data: any[]) {
  return data
    .map((item) => parseInt(item.deaths))
    .reduce((prev, curr) => prev + curr, 0);
}

fs.createReadStream("time_series_covid19_deaths_US.csv")
  .pipe(csv({}))
  .on("data", (data: any[]) => results.push(data))
  .on("end", () => {
    results.forEach((result) =>
      //Creamos un array de estados, numero de poblacion y numero de muertes
      object.push({
        state: result.Province_State,
        population: result.Population,
        deaths: Object.values(result).pop(),
      })
    );
    //Creamos un array con todos los estados sin repetir
    const state = results.map((item) => item.Province_State);
    const stateList = state.filter(
      (item, index) => state.indexOf(item) === index
    );

    stateList.forEach((estado) => {
      const estadoFiltrados = object.filter((item) => item.state === estado);
      const total = totalPoblation(estadoFiltrados);
      const death = totalDeaths(estadoFiltrados);
      //Organizamos los datos por un unico estado
      data.push({
        state: estado,
        population: total,
        deaths: death,
        porcentaje: ((death * 100) / total).toFixed(2),
      });
    });
    //Ordenar el array por el numero de muertes de manera descendente
    const resultadosOrdenados = data.sort((a, b) => b.deaths - a.deaths);
    const estadomasafectado = resultadosOrdenados[0].state;
    //Ordenar el array por el porcentaje de muertes de manera descendente
    const masAfectado = data.sort((a, b) => b.porcentaje - a.porcentaje);

    //Respuesta a las preguntas
    console.log("-------------------------------------------------------");
    console.log(`Estado con mayor acumulado a la fecha ${estadomasafectado}`);
    console.log("-------------------------------------------------------");
    console.log(
      `Estado con menor acumulado a la fecha ${
        resultadosOrdenados[resultadosOrdenados.length - 1].state
      }`
    );
    console.log("-------------------------------------------------------");
    data.forEach((data) =>
      console.log(
        `${data.state} tiene un porcentaje de muerte ${data.porcentaje}%`
      )
    );
    console.log("-------------------------------------------------------");
    console.log(
      `El estado mas afectado es ${masAfectado[1].state} por que tiene el mayor porcentaje de muertes en su poblcacion ${masAfectado[1].porcentaje}%`
    );
  });

/* 
 El estado con mayor acumulado despues de organizar el arreglo de manera descendente fue california,
 lo guarde en una variable aparte por que me estaba generando un error raro.

 El estado con menor acumulado fue Diamond Princess

 Cree el objeto con la propiedad porcentaje para tener el valor de muertes vs poblacion para cada estado 
 recorri el arreglo con el foreach y lo imprimi en la consola.

 Para el estado mas afectado organice el arreglo por el porcentaje de muertes y lo imprima en la consola.
 
 En los resultados tengo dos datos que generan problemas uno es el estado de Diamon Princess 
 que su poblacion es de 0 y su numero de muertes igual y el estado de Grand Princess que su poblacion
 es de 0 y sus muertes fueron 3 entonces sus porcentaje me da un Infinito 
 
 Por eso en el estado mas afectado inicio el array en la posición 1
 */
