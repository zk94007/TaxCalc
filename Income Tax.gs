function TaxAmount(income,state){
  if(!income || !state){ return "Missing parameters";}
  
  if(state.length != 2){
    state = STATE_FULL_TO_ABBREVIATION(state);
    if(!state){ return "State not found"; }
  }else{
    state.toUpperCase();
  }
  
  var taxAmt = FederalTaxAmt(income);
  
  switch (state) {
    case "AK":
    case "FL":
    case "NV":
    case "SD":
    case "TX":
    case "WA":
    case "WY":
      break; //no income tax
    case "AZ":
      taxAmt += ArizonaTaxAmt(income); break;
    case "CA":
      taxAmt += CaliforniaTaxAmt(income); break;
    case "OH":
      taxAmt += OhioTaxAmt(income); break;
    case "WI":
      taxAmt += WisconsinTaxAmt(income); break;
    default:
      taxAmt = "No info on that state";
  }
  return taxAmt;
}

//https://www.irs.com/articles/2015-federal-tax-rates-personal-exemptions-and-standard-deductions
function FederalTaxAmt(income) {
  const taxInfo = [
    {'rate':0.1, 'start':0},
    {'rate':0.15, 'start':9275},
    {'rate':0.25, 'start':37650},
    {'rate':0.28, 'start':91150},
    {'rate':0.33, 'start':190150}, 
    {'rate':0.35, 'start':413350},  
    {'rate':0.396, 'start':415050}
    ];
  return TaxRateFromBrackets(income, taxInfo );
}
/*
https://www.revenue.wi.gov/faqs/pcs/taxrates.html
*/
function WisconsinTaxAmt(income) {
  const taxInfo = [
    {'rate':0.04, 'start':0},
    {'rate':0.0584, 'start':11090},
    {'rate':0.0627, 'start':22190},
    {'rate':0.0765, 'start':244270}
    ];
  return TaxRateFromBrackets(income, taxInfo );
}
/*
http://www.tax.ohio.gov/ohio_individual/individual/annual_tax_rates.aspx
*/
function OhioTaxAmt(income) {
  const taxInfo = [
    {'rate':0.00712, 'start':0},
    {'rate':0.01424, 'start':5000},
    {'rate':0.02847, 'start':1000},
    {'rate':0.03559, 'start':15000},
    {'rate':0.0427, 'start':20000},
    {'rate':0.04983, 'start':40000},
    {'rate':0.05693, 'start':80000},
    {'rate':0.0661, 'start':100000},
    {'rate':0.07185, 'start':200000}
    ];
  return TaxRateFromBrackets(income, taxInfo );
}

/*
https://www.ftb.ca.gov/forms/2015_California_Tax_Rates_and_Exemptions.shtml
*/
function CaliforniaTaxAmt(income) {
  const taxInfo = [
    {'rate':0.01, 'start':0},
    
    
    {'rate':0.02, 'start':15700},
    {'rate':0.04, 'start':37220},
    {'rate':0.06, 'start':58744},
    {'rate':0.08, 'start':81546},
    {'rate':0.093, 'start':103060},
    {'rate':0.103, 'start':526444},
    {'rate':0.113, 'start':631732},
    {'rate':0.123, 'start':1052886}
    ];
  return TaxRateFromBrackets(income, taxInfo );
}


/*
http://www.bankrate.com/finance/taxes/state-taxes-arizona.aspx
*/
function ArizonaTaxAmt(income) {
  const taxInfo = [
    {'rate':0.0259, 'start':0},
    {'rate':0.0288, 'start':10163},
    {'rate':0.0336, 'start':25407},
    {'rate':0.0424, 'start':50813},
    {'rate':0.0454, 'start':152435}
    ];
  return TaxRateFromBrackets(income, taxInfo );
}

function TaxRateFromBrackets(income, taxInfo){
  var taxAmt = 0;
  
  for(var i=taxInfo.length-1;i>=0;i--){
    var marginalTax = (income - taxInfo[i].start) * taxInfo[i].rate

    if(marginalTax > 0){ 
      income = taxInfo[i].start;
      taxAmt += marginalTax;
    }
  }
  
  return taxAmt;
}
