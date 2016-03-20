<?php
/**
 * app/controllers/Sysconfig.php
 *
 * @author Nicolas CARPi <nicolas.carpi@curie.fr>
 * @copyright 2012 Nicolas CARPi
 * @see http://www.elabftw.net Official website
 * @license AGPL-3.0
 * @package elabftw
 */

/**
 * Deal with ajax requests sent from the sysconfig page
 *
 */
require_once '../../inc/common.php';

try {
    $sysconfig = new \Elabftw\Elabftw\Sysconfig();

    // SEND TEST EMAIL
    if (isset($_POST['testemailSend'])) {
        if ($sysconfig->testemailSend($_POST['testemailEmail'])) {
            echo '1';
        } else {
            echo '0';
        }
    }

} catch (Exception $e) {
    dblog('Error', $_SESSION['userid'], $e->getMessage());
}
