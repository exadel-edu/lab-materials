function getIp() {
    var os=require('os');
    var ifaces=os.networkInterfaces();
    
    for (var dev in ifaces) {
        for(var i in ifaces[dev]) {
            var details = ifaces[dev][i];
    
            if (details.family=='IPv4' && !details.internal) {
                return details.address;
            }
        }
    }
}

console.log(getIp());

module.exports = getIp;