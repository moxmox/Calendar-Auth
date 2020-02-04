// jshint esversion: 8

//server definition
const server = {
    port: 3000,
    ipaddr: '192.168.0.6',
    init: ''
};

//function definition for initializer
server.init = (cliOptions) => {

    if((cliOptions.length % 2 !== 0) && 
    cliOptions[0] != 'help'){
        console.error('\nIncomplete command!\n');
        console.error('See \'node server help\' for usage\n');
        return false;
    }

    if(cliOptions[0] == 'help'){
        console.log('\n#########################################################');
        console.log('#\tFile Controller Server Script\t\t\t#');
        console.log('#\tUsage: node server <flag> [option]\t\t#');
        console.log('#\tExample: node filecon ip 192.168.1.9 port 3000\t#');
        console.log('#########################################################\n');
        return false;
    }

    if(cliOptions.length > 0)
    {
        for(i=0; i<=cliOptions.length-1; i+=2)
        {
            if(cliOptions[i] == 'ip'){
                server.ipaddr = cliOptions[i+1];
            }

            if(cliOptions[i] == 'port'){
                server.port = cliOptions[i+1];
            }
        }
    }
    return true;
};

module.exports = server;