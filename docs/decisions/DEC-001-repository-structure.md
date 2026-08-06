# DEC-001: Repository Structure

## Status

Approved

## Date

2026-08-06

## Owner

Product Owner

## Context

Pinus is built from scratch by one primary developer using Flutter and NestJS.

## Options

### Option A: Monorepo

Store mobile, backend, documentation, infrastructure, and OpenSpec artifacts
in one repository.

### Option B: Separate Repositories

Maintain independent repositories for mobile and backend.

## Selected Option

Monorepo.

## Reason

A monorepo reduces coordination overhead and keeps product specifications,
code changes, CI, and documentation in the same version history.

## Risks

Mobile and backend release boundaries are less isolated.

## Migration Cost

Medium.

## Revisit Condition

Reconsider when teams, permissions, or release processes become independently managed.