
class FlowController {

    async getIndex(req, res) {
        renderIndex(req, res, 200);
    }

}


async function renderIndex(req, res, code) {
    res.status(code).render('flow/index', {
     
    });
}


module.exports = new FlowController();