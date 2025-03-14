-- Seleccionar todas las mesas
CREATE OR REPLACE PROCEDURE RESTAURANTE.SP_S_MESAS(p_cursor OUT SYS_REFCURSOR) AS
BEGIN
  OPEN p_cursor FOR SELECT * FROM RESTAURANTE.TBL_MESAS; 
END SP_S_MESAS;
/

-- Cambiar el estado de una mesa
CREATE OR REPLACE PROCEDURE RESTAURANTE.SP_U_MESA_ESTADO (
  p_ID IN NUMBER,
  p_ESTADO IN VARCHAR2
) AS
BEGIN
  UPDATE RESTAURANTE.TBL_MESAS
  SET ESTADO = p_ESTADO
  WHERE ID = p_ID;
  
  COMMIT;
END SP_U_MESA_ESTADO;
/

CREATE OR REPLACE PROCEDURE SP_I_TBL_MESAS (p_numero NUMBER, p_estado VARCHAR2) AS
BEGIN
  INSERT INTO RESTAURANTE.TBL_MESAS (NUMERO, ESTADO) VALUES (p_numero, p_estado);
  COMMIT;
END SP_I_TBL_MESAS;
/