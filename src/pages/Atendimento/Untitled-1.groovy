 <Icon
                                      style={{
                                        width: '30px',
                                        height: '30px',
                                        position: 'absolute',
                                        zIndex: 99999,
                                        left: 0,
                                        bottom: -2
                                      }}
                                      aria-owns={open[mensagem.id] ? 'mouse-over-popover' : undefined}
                                      aria-haspopup="true"
                                      onMouseEnter={(e) => handlePopoverOpen(e, mensagem.id)}
                                      onMouseLeave={() => handlePopoverClose(mensagem.id)}
                                      sx={{
                                        color:
                                          mensagem.scheduleDate &&
                                            mensagem.status === 'pending'
                                            ? 'green'
                                            : !['pending', 'canceled'].includes(
                                              mensagem.status
                                            )
                                              ? 'blue'
                                              : '',
                                      }}
                                    >
                                      <CalendarMonth />
                                      {selectedMessageId === mensagem.id && anchorEls &&
                                        <Popover
                                          id="mouse-over-popover"
                                          sx={{ pointerEvents: 'none' }}
                                          open={!!open[mensagem.id]}
                                          // anchorEl={anchorEl}
                                          anchorEl={anchorEls[mensagem.id]}
                                          anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                          }}
                                          transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                          }}
                                          onClose={() => handlePopoverClose(mensagem.id)}
                                          disableRestoreFocus

                                        >
                                          <Box sx={{ p: 2 }}>
                                            <Typography
                                              sx={{ p: 1 }}
                                              variant="subtitle2"
                                            >
                                              {' '}
                                              Mensagem agendada
                                            </Typography>
                                            <Typography
                                              sx={{ p: 1 }}
                                              variant="body2"
                                            >
                                              {' '}
                                              Criado em:{' '}
                                              {formatarData(
                                                mensagem.createdAt,
                                                'dd/MM/yyyy HH:mm'
                                              )}
                                            </Typography>
                                            <Typography
                                              sx={{ p: 1 }}
                                              variant="body2"
                                            >
                                              {' '}
                                              Programado para:{' '}
                                              {formatarData(
                                                mensagem.scheduleDate,
                                                'dd/MM/yyyy HH:mm'
                                              )}
                                            </Typography>
                                          </Box>
                                        </Popover>
                                      }
                                    </Icon>