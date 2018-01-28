import {Application} from "express";
import {createProposition, decrementProposition, deleteProposition, getPropositions, incrementProposition} from "./services/proposition.service";
import {getMatchesByUser, getMatchesByUserSharedLinkLink, getMessagesByMatch, getUser} from "./services/tinder.service";
import {createEmptySharedLink, deleteSharedLink, getSharedLinks, login, updateSharedLinkMatchs} from "./services/user.service";
import {hashUser} from "./utils";

export function registerRoutes(app: Application) {
    app.get("/:sharedLinkLink/user/:id", async (req, res) => res.json(await getUser(req.params.sharedLinkLink, req.params.id)));

    app.get("/:sharedLinkLink/matches", async (req, res) => res.json(await getMatchesByUserSharedLinkLink(req.params.sharedLinkLink)));
    app.get("/:sharedLinkLink/matches/:matchId/messages", async (req, res) => res.json(await getMessagesByMatch(req.params.sharedLinkLink, req.params.matchId)));

    app.post("/matches/:matchId/propositions", async (req, res) => res.json(await createProposition(req.params.matchId, req.body.message)));
    app.get("/matches/:matchId/propositions", async (req, res) => res.json(await getPropositions(req.params.matchId)));
    app.put("/matches/:matchId/propositions/:propositionId/up", async (req, res) => res.json(await incrementProposition(req.params.matchId, req.params.propositionId, hashUser(req))));
    app.put("/matches/:matchId/propositions/:propositionId/down", async (req, res) => res.json(await decrementProposition(req.params.matchId, req.params.propositionId, hashUser(req))));
    app.delete("/matches/:matchId/propositions/:propositionId", async (req, res) => res.json(await deleteProposition(req.params.matchId, req.params.propositionId)));

    app.get("/matches", async (req, res) => res.json(await getMatchesByUser(req.headers.userid as string)));
    app.post("/sharedLinks", async (req, res) => res.json(await createEmptySharedLink(req.headers.userid as string)));
    app.get("/sharedLinks", async (req, res) => res.json(await getSharedLinks(req.headers.userid as string)));
    app.put("/sharedLinks/:sharedLinkLink", async (req, res) => res.json(await updateSharedLinkMatchs(req.headers.userid as string, req.params.sharedLinkLink, req.body as string[])));
    app.delete("/sharedLinks/:sharedLinkLink", async (req, res) => res.json(await deleteSharedLink(req.headers.userid as string, req.params.sharedLinkLink)));

    app.post("/login", async (req, res) => res.json(await login(req.body.token)));
}
