document.addEventListener('DOMContentLoaded', function() { // Se captan por ID los elementos select HTML del Index 
    const marcaSelect = document.getElementById('marca'); // y les asignamos las correspondientes variables.
    const modeloSelect = document.getElementById('modelo');
    const yearSelect = document.getElementById('año');
    const coverageSelect = document.getElementById('coverageType');
  
    fetch('cotizaciones.json') //           Utilizamos el metodo Fetch para traer los datos 
      .then(response => response.json()) // de los automoviles provenientes del archivo JSON.
      .then(data => {
        if (marcaSelect && modeloSelect && yearSelect && coverageSelect) {
          marcaSelect.addEventListener('change', function() {
            updateModels(data); // Actualiza los modelos en función de la marca seleccionada
          });
  
          modeloSelect.addEventListener('change', function() {
            updateYears(data); // Actualiza los años en función del modelo seleccionado
          });
  
          insuranceForm.addEventListener('submit', function(event) {
            event.preventDefault();
            updateQuote(data);
          });
  
          fillCarBrands(data); // Llenar las marcas de automóviles
        }
      })
      .catch(error => console.error('Error al obtener datos del archivo JSON:', error));
  });
  
  const fillCarBrands = data => {
    // Funcion para llenar las marcas de automóviles
    const marcaSelect = document.getElementById('marca');
    if (marcaSelect) {
      data.forEach(brand => {
        const option = document.createElement('option');
        option.text = brand.Marca;
        option.value = brand.Marca;
        marcaSelect.appendChild(option);
      });
    }
  };
  
  const updateModels = data => {
    // Funcion para llenar los modelos de automoviles
    const selectedBrand = document.getElementById('marca').value;
    const modeloSelect = document.getElementById('modelo');
  
    if (modeloSelect) {
      modeloSelect.disabled = false;
      modeloSelect.innerHTML = '<option>Selecciona un Modelo</option>';
      const brandData = data.find(brand => brand.Marca === selectedBrand);
      brandData.Modelos.forEach(model => {
        const option = document.createElement('option');
        option.text = model.Nombre;
        option.value = model.Nombre;
        modeloSelect.appendChild(option);
      });
    }
  
    document.getElementById('año').disabled = true;
    document.getElementById('año').innerHTML = '<option>Selecciona un Año</option>';
    document.getElementById('quoteResult').classList.add('hidden');
  };
  
  const updateYears = data => {
    // Funcion para llenar los años de automoviles
    const selectedBrand = document.getElementById('marca').value;
    const selectedModel = document.getElementById('modelo').value;
    const yearSelect = document.getElementById('año');
  
    if (yearSelect) {
      yearSelect.disabled = false;
      yearSelect.innerHTML = '<option>Selecciona un Año</option>';
      const brandData = data.find(brand => brand.Marca === selectedBrand);
      const modelData = brandData.Modelos.find(model => model.Nombre === selectedModel);
      modelData.Variantes.forEach(variante => {
        const option = document.createElement('option');
        option.text = variante.Año;
        option.value = variante.Año;
        yearSelect.appendChild(option);
      });
    }
  
    document.getElementById('quoteResult').classList.add('hidden');
  };
  
  const updateQuote = data => {
    // Funcion para realizar la cotizacion de automoviles
    const selectedBrand = document.getElementById('marca').value;
    const selectedModel = document.getElementById('modelo').value;
    const selectedYear = document.getElementById('año').value;
    const selectedCoverage = document.getElementById('coverageType').value;
  
    const brandData = data.find(brand => brand.Marca === selectedBrand);
    const modelData = brandData.Modelos.find(model => model.Nombre === selectedModel);
    const yearData = modelData.Variantes.find(variante => variante.Año == selectedYear);
  
    let quoteInDollars = yearData.Tarifa;
  
    fetch('https://dolarapi.com/v1/dolares/blue')
      .then(response => response.json())
      .then(dollarData => {
        const dollarValue = dollarData.venta;
  
        let quoteInPesos = quoteInDollars * dollarValue; 
  
        if (selectedCoverage === 'cobertura_premium') {
          quoteInPesos = quoteInPesos * 1.15;
          quoteInDollars = quoteInDollars * 1.15;
        }
        // Redondear los resultados a dos decimales
        quoteInPesos = Math.round(quoteInPesos * 100) / 100;
        quoteInDollars = Math.round(quoteInDollars * 100) / 100;
  
        const quoteInfo = document.getElementById('quoteInfo');
        quoteInfo.innerHTML = `Cotización en dólares: U$D <b>${quoteInDollars}</b> - Cotización en pesos: ARS <b>${quoteInPesos.toFixed(2)}</b>`;
        const quoteResult = document.getElementById('quoteResult');
        quoteResult.classList.remove('hidden');
      })
      .catch(error => console.error('Error al obtener la cotización del dólar:', error));
  };