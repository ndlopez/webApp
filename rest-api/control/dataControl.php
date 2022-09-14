<?php
class DataController extends BaseController{
    /* /data/list/ */
    public function listAction(){
        $strErrorDesc = '';
        $requestMethod = $_SERVER['REQUEST_METHOD'];
        $arrQueryStringParams = $this->getQueryStringParams();
        $useThis = TRUE;

        if(strtoupper($requestMethod) == 'GET'){
            try{
                $dataModel = new DataModel();
                $intLimit = 10;
                if(isset($arrQueryStringParams['limit']) && $arrQueryStringParams['limit']){
                    $intLimit = $arrQueryStringParams['limit'];
                    $useThis = FALSE;
                }
                
                $arrData = $dataModel->getData($intLimit);
                $outputData = json_encode($arrData);

                //$myDataModel = new DataModel();
                $myDate = '2022-08-29';
                if(isset($arrQueryStringParams['thisDate']) && $arrQueryStringParams['thisDate']){
                    $myDate = $arrQueryStringParams['thisDate'];    
                }/*else{
                    var_dump("Couldnt get input date: ".$myDate);
                }*/
               
                $dateData = $dataModel->get_by_date($myDate);
                $responseData = json_encode($dateData);

            }catch(Error $e){
                $strErrorDesc = $e->getMessage().'sth went wrong';
                $strErrorHeader = 'HTTP/1.1 500 kinda internal server error?';
            }
        }else{
            $strErrorDesc = 'MEthod not supported';
            $strErrorHeader = 'HTTP/1.1 422 Unproc entity';
        }

        //send output
        if(!$strErrorDesc){
            if($useThis){
                $this->sendOutput($responseData,array('Content-Type: application/json','HTTP/1.1 200 OK'));
            }else{
                $this->sendOutput($outputData,array('Content-Type: application/json','HTTP/1.1 200 OK'));
            }
        }else{
            $this->sendOutput(json_encode(array('error'=>$strErrorDesc)),
            array('Content-Type: application/json',$strErrorHeader));
        }
    }
}