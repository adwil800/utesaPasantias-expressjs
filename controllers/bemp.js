


exports.pushCompany = (req, res, next) => {



};


/**
CREATE TABLE empresas(
    idempresa INT,
    tipo VARCHAR(255), ?
    PRIMARY KEY(idempresa),
    FOREIGN KEY (idempresa) REFERENCES terceros(idtercero),
    actividad VARCHAR(255) ?
); 

** ME: ADDON******************************************************** 
CREATE TABLE vacantes_empresas(
    idempresa INT,
    idvacante INT PRIMARY KEY AUTO_INCREMENT,
    idcarrera INT,
    nombre VARCHAR(255),
    FOREIGN KEY (idempresa) REFERENCES empresas(idempresa),
    FOREIGN KEY(idcarrera) REFERENCES carreras(idcarrera)
);
CREATE TABLE habilidades(
    idhabilidad INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255),
);
CREATE TABLE habilidades_vacantes(
    idhabilidad INT,
    idvacante INT,
    FOREIGN KEY (idhabilidad) REFERENCES habilidades(idhabilidad),
    FOREIGN KEY (idvacante) REFERENCES vacantes_empresas(idvacante)
);
CREATE TABLE habilidades_estudiantes(
    idhabilidad INT,
    idestudiante INT,
    FOREIGN KEY (idhabilidad) REFERENCES habilidades(idhabilidad),
    FOREIGN KEY (idestudiante) REFERENCES estudiantes(idestudiante)
);
 */

