-- Asignar un mesero a una mesa
CREATE OR REPLACE PROCEDURE RESTAURANTE.SP_U_ASIGNAR_MESERO (
  p_MESA_ID IN NUMBER,
  p_EMPLEADO_ID IN NUMBER
) AS
BEGIN
  UPDATE RESTAURANTE.TBL_PEDIDO
  SET EMPLEADO_ID = p_EMPLEADO_ID
  WHERE MESA_ID = p_MESA_ID AND ESTADO = 'Pendiente';
  
  COMMIT;
END SP_U_ASIGNAR_MESERO;
/

-- Consultar mesero asignado a una mesa
CREATE OR REPLACE PROCEDURE RESTAURANTE.SP_S_MESERO_POR_MESA (
  p_MESA_ID IN NUMBER
) AS
v_mesero_id NUMBER;
BEGIN
  SELECT EMPLEADO_ID INTO v_mesero_id
  FROM RESTAURANTE.TBL_PEDIDO
  WHERE MESA_ID = p_MESA_ID AND ESTADO = 'Pendiente';

  DBMS_OUTPUT.PUT_LINE('Mesero asignado a mesa ' || p_MESA_ID || ': ' || v_mesero_id);
END SP_S_MESERO_POR_MESA;
/

-- Login
CREATE OR REPLACE PROCEDURE RESTAURANTE.SP_VALIDATE_LOGIN (
    p_username IN VARCHAR2,
    p_password IN VARCHAR2,
    p_valid OUT BOOLEAN,
    p_empleado OUT RESTAURANTE.TBL_EMPLEADO%ROWTYPE
) AS
    v_password_hash VARCHAR2(255);
BEGIN
    -- Intentar obtener el hash de la contraseña para el usuario dado
    BEGIN
        SELECT PASSWORD_HASH, ID, NOMBRE, TIPO, TURNO, USERNAME
        INTO v_password_hash, p_empleado.ID, p_empleado.NOMBRE, p_empleado.TIPO, p_empleado.TURNO, p_empleado.USERNAME
        FROM RESTAURANTE.TBL_EMPLEADO
        WHERE USERNAME = p_username;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            p_valid := FALSE;
            RETURN;
    END;

    -- Validar si la contraseña proporcionada coincide con el hash almacenado
    IF p_password = v_password_hash THEN
        p_valid := TRUE;
    ELSE
        p_valid := FALSE;
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        p_valid := FALSE;
        -- Opcionalmente podrías registrar el error para fines de depuración
END SP_VALIDATE_LOGIN;
/