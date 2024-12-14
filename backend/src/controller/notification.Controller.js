const NotificationService = require('../../database/notificationService');

class NotificationController {
    async CreateNotification(req, res) {
        try {
            const { content } = req.body
            let uid = 'ALL'
            if (req.query.id) uid = req.query.id
            // console.log(uid)

            if (!uid || !content) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The input is required',
                    data: null
                })
            }
            req.body.uid = uid
            const response = await NotificationService.CreateNotification(req.body)
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                status: 404,
                msg: err,
                data: null
            })
        }
    }

    async GetNotification(req, res) {
        try {
            let uid = 'ALL'
            if (req.query.id) uid = req.query.id

            if (!uid) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The input is required',
                    data: null
                })
            }
            const response = await NotificationService.GetNotification(uid)
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                status: 404,
                msg: err,
                data: null
            })
        }
    }

    async DeleteNotification(req, res) {
        try {
            let uid = 'ALL'
            if (req.query.id) uid = req.query.id
            const {content} = req.body
            if ( !(uid && content) ) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The input is required',
                    data: null
                })
            }
            req.body.uid = uid
            const response = await NotificationService.DeleteNotification(req.body)
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                status: 404,
                msg: err,
                data: null
            })
        }
    }

    async UpdateNotification(req, res) {
        try {
            let uid = 'ALL'
            if (req.query.id) uid = req.query.id
            const {content, update_content} = req.body
            if (!(uid && content && update_content)) {
                return res.status(400).json({
                    status: 400,
                    msg: 'The input is required',
                    data: null
                })
            }
            req.body.uid = uid
            const response = await NotificationService.UpdateNotification(req.body)
            return res.status(200).json(response)
        }
        catch (err) {
            return res.status(404).json({
                status: 404,
                msg: err,
                data: null
            })
        }
    }
}

module.exports = new NotificationController;