import {Application} from "express";
import {createEmptySharedLink, deleteSharedLink, getMatchesByUser, getSharedLinks, updateSharedLinkMatches} from "./services/admin.service";
import {login} from "./services/login.service";
import {createProposition, decrementProposition, deleteProposition, getPropositions, incrementProposition} from "./services/proposition.service";
import {getMatchesByUserSharedLinkLink, getMessagesByMatch, getUser} from "./services/user.service";
import {hashUser} from "./utils";

export function registerRoutes(app: Application) {
    // When user looks "shared link"...
    // display shared matches, on left side
    app.get("/:sharedLinkLink/matches", async (req, res) => res.json(await getMatchesByUserSharedLinkLink(req.params.sharedLinkLink)));
    // display user profile, on right side
    app.get("/:sharedLinkLink/user/:id", async (req, res) => res.json(await getUser(req.params.sharedLinkLink, req.params.id)));
    // display conversation, on middle side
    app.get("/:sharedLinkLink/matches/:matchId/messages", async (req, res) => res.json(await getMessagesByMatch(req.params.sharedLinkLink, req.params.matchId)));
    // proposition management: list, create, delete, voting
    app.post("/matches/:matchId/propositions", async (req, res) => res.json(await createProposition(req.params.matchId, req.body.message)));
    app.get("/matches/:matchId/propositions", async (req, res) => res.json(await getPropositions(req.params.matchId)));
    app.put("/matches/:matchId/propositions/:propositionId/up", async (req, res) => res.json(await incrementProposition(req.params.matchId, req.params.propositionId, hashUser(req))));
    app.put("/matches/:matchId/propositions/:propositionId/down", async (req, res) => res.json(await decrementProposition(req.params.matchId, req.params.propositionId, hashUser(req))));
    app.delete("/matches/:matchId/propositions/:propositionId", async (req, res) => res.json(await deleteProposition(req.params.matchId, req.params.propositionId)));

    // When admin is logged...
    // list all matches, in order to enable/disable sharing
    app.get("/matches", async (req, res) => res.json(await getMatchesByUser(req.headers.userid as string)));
    // click on "add" button, in order to create new "shared link"
    app.post("/sharedLinks", async (req, res) => res.json(await createEmptySharedLink(req.headers.userid as string)));
    // list all "shared link", in order to display into listbox
    app.get("/sharedLinks", async (req, res) => res.json(await getSharedLinks(req.headers.userid as string)));
    // click on "update" button, in order to update list of matches to share
    app.put("/sharedLinks/:sharedLinkLink", async (req, res) => res.json(await updateSharedLinkMatches(req.headers.userid as string, req.params.sharedLinkLink, req.body as string[])));
    // click on "delete" button, in order to revoke a "shared link"
    app.delete("/sharedLinks/:sharedLinkLink", async (req, res) => res.json(await deleteSharedLink(req.headers.userid as string, req.params.sharedLinkLink)));

    // Provider token management
    app.post("/login", async (req, res) => res.json(await login(req.body.token)));
}
