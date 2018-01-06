import {Application} from "express";
import {createProposition, decrementProposition, deleteProposition, getPropositions, incrementProposition} from "./proposition-services";
import {getMatches, getMessagesByMatch, getUser} from "./tinder-services";

export function registerRoutes(app: Application) {
    app.get("/user/:id", async (req, res) => res.json(await getUser(req.params.id)));

    app.get("/matches", async (req, res) => res.json(await getMatches()));
    app.get("/matches/:matchId/messages", async (req, res) => res.json(await getMessagesByMatch(req.params.matchId)));

    app.post("/matches/:matchId/propositions", async (req, res) => res.json(await createProposition(req.params.matchId, req.body)));
    app.get("/matches/:matchId/propositions", async (req, res) => res.json(await getPropositions(req.params.matchId)));
    app.put("/matches/:matchId/propositions/:propositionId/up", async (req, res) => res.json(await incrementProposition(req.params.matchId, req.params.propositionId)));
    app.put("/matches/:matchId/propositions/:propositionId/down", async (req, res) => res.json(await decrementProposition(req.params.matchId, req.params.propositionId)));
    app.delete("/matches/:matchId/propositions/:propositionId", async (req, res) => res.json(await deleteProposition(req.params.matchId, req.params.propositionId)));
}
