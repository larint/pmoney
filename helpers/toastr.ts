import { Request } from 'express'

export interface MessageApp {
    show: 'toast' | 'normal' | 'alert',
    type: 'warning' | 'success' | 'error' | 'info',
    content: string
}
/**
 * using plugin https://cdnjs.com/libraries/toastr.js
 */
class ToaStr {

    /**
     * 
     * @param req 
     * @param message 
     * @param live use socket real-time notification
     */
    static set = (req: Request, message: MessageApp, live: boolean = false) => {
        req.session!.message = message
    }

}

export { ToaStr }