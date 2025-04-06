const amplifyconfig = {
  aws_project_region: 'us-east-1',

  // Configuración del servicio Geo (Amazon Location Service)
  geo: {
    AmazonLocationService: {
      region: 'us-east-1',
      trackerName: 'ToroidalTracker'
    }
  }
};

export default amplifyconfig;
