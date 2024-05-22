
export const gitAuth =  async (req, res)=>{}

export const callbackGit =  async (req, res)=>{
    req.session.user=req.user
    res.setHeader('Content-Type','application/json');
    return res.redirect('/productos')
}

