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
router.get("/:sharedLinkLink/user/:id", async (req, res) => res.json(await getUser(req.params.sharedLinkLink, req.params.id)));
// display conversation, on middle side
router.get("/:sharedLinkLink/matches/:matchId/messages", async (req, res) => res.json(await getMessagesByMatch(req.params.sharedLinkLink, req.params.matchId)));
// proposition management: list, create, delete, voting
router.post("/matches/:matchId/propositions", async (req, res) => res.json(await createProposition(req.params.matchId, req.body.message)));
router.get("/matches/:matchId/propositions", async (req, res) => res.json(await getPropositions(req.params.matchId)));
router.put("/matches/:matchId/propositions/:propositionId/up", async (req, res) => res.json(await incrementProposition(req.params.matchId, req.params.propositionId, hashUser(req))));
router.put("/matches/:matchId/propositions/:propositionId/down", async (req, res) => res.json(await decrementProposition(req.params.matchId, req.params.propositionId, hashUser(req))));
router.delete("/matches/:matchId/propositions/:propositionId", async (req, res) => res.json(await deleteProposition(req.params.matchId, req.params.propositionId)));

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
router.post("/login/:provider", async (req, res) => res.json(await login(req.params.provider, req.body.secret)));
router.put("/login/:provider", async (req, res) => res.json(await registerCredentials(req.headers.userid as string, req.params.provider, req.body.secret)));
router.get("/login/status", async (req, res) => res.json(await checkCredentials(req.headers.userid as string)));

export default router;
