/**
 * Interruptores temporales de módulos.
 *
 * RNDC_EXPEDICION_HABILITADA
 *   Controla el acceso al módulo de Expedición de Remesas y Manifiestos
 *   (/rndc/expedicion) y a su pestaña de Configuración de credencial.
 *
 *   Está en `false` mientras el Ministerio de Transporte habilita la cuenta con
 *   rol de Empresa de Transporte del cliente: sin ella el RNDC rechaza toda
 *   expedición, así que el módulo no debe quedar al alcance de los usuarios.
 *
 *   Para reactivarlo: poner `true`, `npm run build` y desplegar. No hay que
 *   tocar nada más; el Dashboard vuelve a mostrar el botón y la ruta se abre.
 */
export const RNDC_EXPEDICION_HABILITADA = false;
