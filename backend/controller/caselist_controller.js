const Caselist = require("../model/CaseList");

const getallCase = async (req, res) => {
  try {
    let allcase = await Caselist.find();
    return res
      .status(200)
      .json({
        success: true,
        message: "Case list retrieved successfully",
        data: allcase,
      });
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};

const getCompletedCase = async (req, res) => {
  try {
    let completedcase = await Caselist.find({ status: "notcompleted" });
    return res.status(200).json({ success: true, message: "Cases retrieved successfully", data: completedcase });
  } catch (error) {
    console.error("Error fetching completed cases:", error);
    return res.status(500).json({ success: false, message: "Failed to retrieve cases", error: error.message });
  }
}

const addcase = async (req, res) => {
  try {
    const { case_name, status, condition } = req.body;

    const newcase = await Caselist.create({
      case_name,
      status,
      condition,
    });

    return res
      .status(200)
      .json({
        success: true,
        message: "case added succesfully",
        data: newcase,
      });
  } catch (err) {
    return res.status(400).json(err);
  }
};

const lockUnlock = async (req, res) => {
    try {
        
        const { condition, email, caseId } = req.body;
        console.log(email)

        const foundCase = await Caselist.findById(caseId);

        if (!foundCase) {
            return res.status(404).json({ error: "Case not found" });
        }

        if (condition !== "lock" && condition !== "unlock") {
            return res.status(400).json({ error: "Invalid condition" });
        }

        if (condition === 'lock') {
            if (foundCase.condition === 'lock') {
                return res.status(400).json({ error: "Case is already locked" });
            }
            foundCase.condition = 'lock';

            foundCase.lockedBy = email; 
        }

        if (condition === 'unlock') {
            if (foundCase.condition === 'unlock') {
                return res.status(400).json({ error: "Case is already unlocked" });
            }
            if (foundCase.lockedBy !== email) {
                return res.status(403).json({ error: "You are not authorized to unlock this case" });
            }
            foundCase.condition = 'unlock';
            foundCase.lockedBy = null; 
        }

        await foundCase.save();

        res.status(200).json({ condition: foundCase.condition, lockedBy: foundCase.lockedBy });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const completed = async (req, res) => {
  try {
    const { email,caseId } = req.body;

    // if (!email || !status || !caseId) {
    //   return res.status(400).json({ error: "Missing required parameters" });
    // }

    const foundCase = await Caselist.findById(caseId);
    if (!foundCase) {
      return res.status(404).json({ error: "Case not Found" });
    }

    if (foundCase.status === 'completed') {
      return res.status(400).json({ error: "Case Already Completed" });
    }

    if (foundCase.condition === 'lock') {
      if (foundCase.lockedBy !== email) {
        return res.status(403).json({ error: "This case is locked by someone else" });
      }
    }

    foundCase.status = 'completed';
    await foundCase.save();

    res.status(200).json({ condition: foundCase});
  } catch (error) {
    console.error("Error in completed endpoint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


module.exports = { getallCase, addcase, lockUnlock,completed ,getCompletedCase};
