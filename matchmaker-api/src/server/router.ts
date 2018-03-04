import {Router} from "express";
import {createEmptySharedLink, deleteSharedLink, getMatchesByUser, getSharedLinks, updateSharedLinkMatches} from "../services/admin.service";
import {checkCredentials, login, registerCredentials} from "../services/login.service";
import {createProposition, decrementProposition, deleteProposition, getPropositions, incrementProposition} from "../services/proposition.service";
import {getMatchesByUserSharedLinkLink, getMessagesByMatch, getUser} from "../services/user.service";
import {hashUser} from "../utils";

const router = Router();

// When user looks "shared link"...
// display shared matches, on left side
router.get("/:sharedLinkLink/matches", async (req, res) => res.json(await getMatchesByUserSharedLinkLink(req.params.sharedLinkLink)));
// display user profile, on right side
router.get("/:sharedLinkLink/user/:providerUserId", async (req, res) => res.json(await getUser(req.params.sharedLinkLink, req.params.providerUserId)));
// display conversation, on middle side
router.get("/:sharedLinkLink/matches/:providerMatchId/messages", async (req, res) => res.json(await getMessagesByMatch(req.params.sharedLinkLink, req.params.providerMatchId)));
// proposition management: list, create, delete, voting
router.post("/matches/:providerMatchId/propositions", async (req, res) => res.json(await createProposition(req.params.providerMatchId, req.body.message)));
router.get("/matches/:providerMatchId/propositions", async (req, res) => res.json(await getPropositions(req.params.providerMatchId)));
router.put("/matches/:providerMatchId/propositions/:propositionId/up", async (req, res) => res.json(await incrementProposition(req.params.providerMatchId, req.params.propositionId, hashUser(req))));
router.put("/matches/:providerMatchId/propositions/:propositionId/down", async (req, res) => res.json(await decrementProposition(req.params.providerMatchId, req.params.propositionId, hashUser(req))));
router.delete("/matches/:providerMatchId/propositions/:propositionId", async (req, res) => res.json(await deleteProposition(req.params.providerMatchId, req.params.propositionId)));

// When admin is logged...
// list all matches, in order to enable/disable sharing
router.get("/matches", async (req, res) => res.json(await getMatchesByUser(req.headers.userid as string)));
// click on "add" button, in order to create new "shared link"
router.post("/sharedLinks", async (req, res) => res.json(await createEmptySharedLink(req.headers.userid as string)));
// list all "shared link", in order to display into listbox
router.get("/sharedLinks", async (req, res) => res.json(await getSharedLinks(req.headers.userid as string)));
// click on "update" button, in order to update list of matches to share
router.put("/sharedLinks/:sharedLinkLink", async (req, res) => res.json(await updateSharedLinkMatches(req.headers.userid as string, req.params.sharedLinkLink, req.body as string[])));
// click on "delete" button, in order to revoke a "shared link"
router.delete("/sharedLinks/:sharedLinkLink", async (req, res) => res.json(await deleteSharedLink(req.headers.userid as string, req.params.sharedLinkLink)));

// Provider secret management
router.post("/login/:providerKey", async (req, res) => res.json(await login(req.params.providerKey, req.body.secret)));
router.put("/login/:providerKey", async (req, res) => res.json(await registerCredentials(req.headers.userid as string, req.params.providerKey, req.body.secret)));
router.get("/login/status", async (req, res) => res.json(await checkCredentials(req.headers.userid as string)));

export default router;
