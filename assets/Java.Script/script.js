const inputCLP = document.querySelector('input[type="number"]');
const selectMoneda = document.querySelector('select');
const btnBuscar = document.querySelector('button');
const divGrafico = document.getElementById('grafico');
const divError = document.getElementById('error'); 

selectMoneda.innerHTML += '<option value="euro">Euro</option>';

btnBuscar.addEventListener('click', async () => {
  const montoCLP = inputCLP.value;
  const monedaDestino = selectMoneda.value;

  try {
    const response = await fetch('https://mindicador.cl/api');
    const data = await response.json();

    const tipoCambio = data[monedaDestino].valor;
    const resultadoFormateado = (montoCLP / tipoCambio).toLocaleString('es-CL', { minimumFractionDigits: 1.0 });
    const divResultado = document.getElementById('p_res');
    divResultado.textContent = `El resultado es: ${resultadoFormateado} ${monedaDestino}`;

    const responseHistorial = await axios.get('https://mindicador.cl/api', {
      params: {
        start_date: moment().subtract(10, 'days').format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD')
      }
    });

    
    const labels = responseHistorial.data.serie.map(d => d.fecha);
    const valores = responseHistorial.data.serie.map(d => d.valor);

    
    if (labels.length > 0 && valores.length > 0) {
      console.log("Datos para el gráfico:", labels, valores);
      const myChart = new Chart(divGrafico, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: `Historial de ${monedaDestino}`,
            data: valores,
            borderColor: 'rgb(75, 192, 192)',
            fill: false
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    } else {
      console.error("No hay datos disponibles para el gráfico");
      divError.textContent = "Lo sentimos, no se encontraron datos suficientes para mostrar el gráfico. Por favor, intenta más tarde o verifica tu conexión a internet.";
    }
  } 
  catch (error) {
    divError.textContent = `Error al obtener los datos: ${error.message}`;
  }
});
