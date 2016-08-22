'use strict';

// app-level requires
var express = require('express');
var contracts = require('eris-contracts');
var fs = require('fs');

// setup express app
var app = express();
var appPort = process.env.APP_PORT || 3000;
app.set('view engine', 'pug');
app.use(require('body-parser').urlencoded({ extended: false }));

// setup ipfs
var ipfsAPI = require('ipfs-api');
var ipfs = ipfsAPI({host: 'localhost', port: '5001', procotol: 'http'});

// code contracts' variables populated
var abiDirectory = process.env.ABI_DIRECTORY || './abi/',
  chainName = process.env.CHAIN_NAME || 'dual_integrator',
  chainHost = 'localhost', // chainName
  chainPort = process.env.CHAIN_PORT || 1337,
  factoryContractName = process.env.FACTORY_CONTRACT_NAME || 'IntegratorFactory',
  codeContractName = process.env.CODE_CONTRACT_NAME || 'DualIntegrator',
  codeContractAddress = '',
  keyFile = process.env.KEY_FILE || './accounts.json',
  jobsOutputFile = process.env.JOBS_FILE || './jobs_output.json';

var chainUrl = 'http://' + chainHost + ':' + chainPort + '/rpc';
var factoryContractAddress = require(jobsOutputFile)['deploy' + factoryContractName];
var keys = require(keyFile)[(chainName + '_full_000')];
var partyAAddress = keys.address;
var partyBAddress = require(keyFile)[(chainName + '_participant_000')].address;
var chainID = partyAAddress; // THIS IS A HACK UNTIL CHAINID's BETTER ON EDB/ERIS.js

var factory = contracts.newContractManagerDev(chainUrl, keys)
  .newContractFactory(JSON.parse(fs.readFileSync(abiDirectory + factoryContractName, 'utf8')))
  .at(factoryContractAddress);

// prose contracts' variables populated
var proseContractsDirectory = process.env.PROSE_CONTRACTS_DIR || './contracts/prose/',
  proseContractsTemplateFile = process.env.PROSE_CONTRACTS_FILE_NAME || 'template.commonform',
  proseContractsTitle = process.env.PROSE_CONTRACTS_TITLE || 'Sample Dual Integrated Contract',
  proseContractsDefaultTerms = process.env.PROSE_CONTRACTS_DEFAULT_TERMS || 'template.json',
  proseContractsHash = '',
  proseContractOpts = {html5: true, title: proseContractsTitle};

var proseContractsDefaultTerms = JSON.parse(fs.readFileSync(proseContractsDirectory + proseContractsDefaultTerms, 'utf8'));
var proseContractsTemplateString = fs.readFileSync(proseContractsDirectory + proseContractsTemplateFile, 'utf8');

// test prefill
proseContractsDefaultTerms['Contract Factory Address'] = factoryContractAddress;
proseContractsDefaultTerms['Chain ID'] = chainID;
proseContractsDefaultTerms['Party A Address'] = partyAAddress;
proseContractsDefaultTerms['Party B Address'] = partyBAddress;

// default route should submit the form.
app.get('/', function (req, res) {
  function returnToSender() {
    res.render('index', {
      title: 'Dual Integrator | Home',

      // static variables
      partyAAddress: partyAAddress,
      partyBAddress: partyBAddress,
      factoryContractAddress: factoryContractAddress,
      factoryContractAddresses: factoryContractAddresses,

      // fields users will fill in
      partyAName: partyAName,
      partyBName: partyBName,
      numberOfMonths: numberOfMonths
    });
  };

  // deploys the instrument contract
  function getAllContracts() {
    factory.getAddresses(function(error, result) {
      if (error != null) {
        throw error;
      }
      factoryContractAddresses = result;
      return returnToSender();
    });
  };

  // defaults
  var factoryContractAddresses = [ ],
    partyAName = proseContractsDefaultTerms['Party A Name'],
    partyBName = proseContractsDefaultTerms['Party B Name'],
    numberOfMonths = proseContractsDefaultTerms['Number of Months'];

  getAllContracts();
});

// submit POST route is what accepts the parameters and performs the dual integration process
app.post('/contract', function(req, res) {
  function returnToSender() {
    res.redirect('/contract/' + codeContractAddress);
  };

  function addIPFSHashToCodeContract(hash) {
    proseContractsHash = hash[0].hash;

    var codeContract = contracts.newContractManagerDev(chainUrl, keys)
      .newContractFactory(JSON.parse(fs.readFileSync(abiDirectory + codeContractName, 'utf8')))
      .at(codeContractAddress);

    codeContract.setHash(proseContractsHash, function(error, result) {
      if (error != null) {
        throw error;
      }
      return returnToSender();
    });
  }

  function sendHashToIPFS() {
    ipfs.util.addFromStream(new Buffer(proseContractAsHTML, "utf-8"), function(err, result) {
      if (err) {
        throw err
      }
      return addIPFSHashToCodeContract(result);
    });
  }

  function signDocumentWithDocusign(){
    // TODO
  }

  // returns the formulated document
  function renderProseContract(form, blanks) {
    // stolen from https://github.com/commonform/commonform-cli/blob/master/source/transform-for-format.js#L58-L70
    blanks = Object.keys(blanks)
      .reduce(function(output, key) {
        var value = blanks[key]
        form.directions.filter(function(direction) {
            return direction.identifier === key
          })
          .forEach(function(direction) {
            output.push({
              blank: direction.path,
              value: value })
          })
        return output
        },
        [ ]
      );

    proseContractAsHTML = require('commonform-html')(form.form, blanks, proseContractOpts);
    return sendHashToIPFS();
  }

  // ensures that the prose params are properly populated
  function assembleProseParams(form) {
    // recieve from the submission of the form
    proseContractsDefaultTerms['Party A Name'] = partyAName;
    proseContractsDefaultTerms['Party B Name'] = partyBName;
    proseContractsDefaultTerms['Number of Months'] = numberOfMonths;
    proseContractsDefaultTerms['Contract Address'] = codeContractAddress;

    return renderProseContract(form, proseContractsDefaultTerms);
  }

  // returns a common form object with both form and directions
  function parseProseContract() {
    var form = require('commonform-markup-parse')(proseContractsTemplateString);
    return assembleProseParams(form);
  }

  // deploys the instrument contract
  function deployCodeContract() {
    factory.createInstrument(numberOfMonths, partyAAddress, partyBAddress, partyAName, partyBName, function(error, result) {
      if (error != null) {
        throw error;
      }
      codeContractAddress = result;
      return parseProseContract();
    });
  }

  // defaults
  var proseContractAsHTML = '',
    proseContractsHash = '',
    partyAName = req.body.partyAName,
    partyBName = req.body.partyBName,
    numberOfMonths = req.body.numberOfMonths;

  deployCodeContract();
});

app.get('/contract/:address', function(req, res) {
  function returnToSender() {
    res.render('contract', {
      title: "Dual Integrator | Contract: " + codeContractAddress,

      // static variables
      partyAAddress: partyAAddress,
      partyBAddress: partyBAddress,
      factoryContractAddress: factoryContractAddress,
      codeContractAddress: codeContractAddress,
      partyAName: partyAName,
      partyBName: partyBName,
      numberOfMonths: numberOfMonths,
      proseContractsHash: proseContractsHash,
      proseContractAsHTML: proseContractAsHTML
    });
  }

  function populateHTML() {
    ipfs.files.get(proseContractsHash, function(error, stream) {
      if (error != null) {
        throw error;
      }

      stream.on('data', (chunk) => {
        proseContractAsHTML += chunk.content.read().toString();
      })

      stream.on('end', () => {
        return returnToSender();
      });
    })
  }

  function populateSecondParams() {
    codeContract.getNames(function(error, result) {
      if (error != null) {
        throw error;
      }
      proseContractsHash = result;
      // partyAName = result._partyAName;
      // partyBName = result._partyBName;
      return populateHTML();
    });
  };

  function populateFirstParms() {
    codeContract.getParams(function(error, result) {
      if (error != null) {
        throw error;
      }
      numberOfMonths = result[0]['c'][0];
      partyAAddress = result[1];
      partyBAddress = result[2];
      return populateSecondParams();
    });
  };

  // defaults
  var numberOfMonths = '',
      partyAName = '',
      partyBName = '',
      proseContractAsHTML = '';

  // correct contract
  codeContractAddress = req.params.address;
  var codeContract = contracts.newContractManagerDev(chainUrl, keys)
    .newContractFactory(JSON.parse(fs.readFileSync(abiDirectory + codeContractName, 'utf8')))
    .at(codeContractAddress);

  populateFirstParms();
});

app.listen(appPort, function () {
  console.log('Example app listening on appPort ' + appPort + '.');
});
